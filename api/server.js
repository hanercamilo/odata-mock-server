import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import qs from "qs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const port = 4000;

function loadJSON(file, entity) {
  let entities = entity ? "entities" : "";
  return JSON.parse(fs.readFileSync(path.join(__dirname, "../data", entities, file), "utf8"));
}

function loadXML(file) {
  return fs.readFileSync(path.join(__dirname, "../data", file), "utf8");
}

const odataInfo = loadJSON("odata.json", false);

app.get("/odata", (req, res) => res.json(odataInfo));

app.get("/odata/\\$metadata", (req, res) => {
  const xml = loadXML("metadata.xml");
  res.type("application/xml").send(xml);
});

app.get("/odata/:entity", (req, res) => {
  const entity = req.params.entity;
  const file = `${entity}.json`;
  let entities = entity.includes("odata") ? "" : "entities";

  if (!fs.existsSync(path.join(__dirname, "../data", entities, file))) {
    return res.status(404).json({ error: "Entity not found" });
  }

  let data = loadJSON(file, true);
  const query = qs.parse(req.query);

  // $filter - soporta navegación (ej: Empleado/Persona/nombre)
  if (query.$filter) {
    const f = query.$filter;

    // Cargar entidades para filtros navegados
    const allEntities = {
      Clientes: loadJSON("Clientes.json", true),
      Empleados: loadJSON("Empleados.json", true),
      Personas: loadJSON("Personas.json", true),
      Productos: loadJSON("Productos.json", true),
      Ventas: loadJSON("Ventas.json", true),
      TipoDocumentos: loadJSON("TipoDocumentos.json", true)
    };

    // Patrón para funciones: contains(path, 'value')
    const funcMatch = /(\w+)\((.*?),\s*'([^']+)'\)/i.exec(f);

    if (funcMatch) {
      const [, func, path, value] = funcMatch;
      const pathParts = path.split('/');

      data = data.filter(item => {
        let current = item;

        // Navegar por el path
        for (let i = 0; i < pathParts.length; i++) {
          const part = pathParts[i];

          // Si es una navegación, buscar la entidad relacionada
          if (part === 'Empleado' && current.empleadoId) {
            current = allEntities.Empleados.find(e => e.id === current.empleadoId);
          } else if (part === 'Cliente' && current.clienteId) {
            current = allEntities.Clientes.find(c => c.id === current.clienteId);
          } else if (part === 'Persona' && current.personaId) {
            current = allEntities.Personas.find(p => p.id === current.personaId);
          } else if (part === 'Producto' && current.productoId) {
            current = allEntities.Productos.find(p => p.id === current.productoId);
          } else if (part === 'TipoDocumento' && current.tipoDocumentoId) {
            current = allEntities.TipoDocumentos.find(t => String(t.id) === String(current.tipoDocumentoId));
          } else if (i === pathParts.length - 1) {
            // Última parte: es la propiedad a evaluar
            current = current?.[part];
          }

          if (!current) return false;
        }

        const itemValue = current;
        if (itemValue === undefined || itemValue === null) return false;

        // Aplicar la función
        switch (func.toLowerCase()) {
          case 'contains': return String(itemValue).toLowerCase().includes(value.toLowerCase());
          case 'startswith': return String(itemValue).toLowerCase().startsWith(value.toLowerCase());
          case 'endswith': return String(itemValue).toLowerCase().endsWith(value.toLowerCase());
          default: return false;
        }
      });
    } else {
      // Filtro simple (sin navegación): campo operator valor
      const ops = /(.*?) (eq|ne|gt|lt|ge|le|contains|startswith|endswith) (.*)/i.exec(f);
      if (ops) {
        const [, field, operator, rawVal] = ops;
        const value = rawVal.replace(/'/g, "").trim();
        data = data.filter(item => {
          const itemValue = item[field];
          if (itemValue === undefined || itemValue === null) return false;
          switch (operator.toLowerCase()) {
            case 'eq': return String(itemValue).toLowerCase() === String(value).toLowerCase();
            case 'ne': return String(itemValue).toLowerCase() !== String(value).toLowerCase();
            case 'gt': return parseFloat(itemValue) > parseFloat(value);
            case 'lt': return parseFloat(itemValue) < parseFloat(value);
            case 'ge': return parseFloat(itemValue) >= parseFloat(value);
            case 'le': return parseFloat(itemValue) <= parseFloat(value);
            case 'contains': return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
            case 'startswith': return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'endswith': return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase());
            default: return true;
          }
        });
      }
    }
  }

  // $orderby
  if (query.$orderby) {
    const [field, direction] = query.$orderby.split(" ");
    data = data.sort((a, b) => {
      if (a[field] < b[field]) return direction === "desc" ? 1 : -1;
      if (a[field] > b[field]) return direction === "desc" ? -1 : 1;
      return 0;
    });
  }

  // $top
  if (query.$top) {
    data = data.slice(0, Number(query.$top));
  }

  // $expand
  if (query.$expand) {
    //console.log("📥 Original $expand:", query.$expand);

    const allEntities = {
      Clientes: loadJSON("Clientes.json", true),
      Empleados: loadJSON("Empleados.json", true),
      Personas: loadJSON("Personas.json", true),
      Productos: loadJSON("Productos.json", true),
      Ventas: loadJSON("Ventas.json", true),
      TipoDocumentos: loadJSON("TipoDocumentos.json", true)
    };

    // Parser que maneja correctamente los paréntesis
    function parseExpand(expandStr) {
      const result = [];
      let current = '';
      let depth = 0;
      let inParens = '';
      let navProperty = '';

      for (let i = 0; i < expandStr.length; i++) {
        const char = expandStr[i];

        if (char === '(') {
          if (depth === 0) {
            navProperty = current.trim();
            current = '';
          } else {
            inParens += char;
          }
          depth++;
        } else if (char === ')') {
          depth--;
          if (depth === 0) {
            result.push({
              property: navProperty,
              options: inParens
            });
            navProperty = '';
            inParens = '';
            current = '';
          } else {
            inParens += char;
          }
        } else if (char === ',' && depth === 0) {
          if (current.trim()) {
            result.push({
              property: current.trim(),
              options: null
            });
          }
          current = '';
        } else {
          if (depth > 0) {
            inParens += char;
          } else {
            current += char;
          }
        }
      }

      if (current.trim()) {
        result.push({
          property: current.trim(),
          options: null
        });
      }

      //console.log("🔍 Parsed expand:", JSON.stringify(result, null, 2));
      return result;
    }

    // Extrae $select y $expand de las opciones
    function parseOptions(optionsStr) {
      if (!optionsStr) return {};

      const opts = { select: null, expand: null };
      let current = '';
      let depth = 0;
      let key = '';

      const parts = [];
      for (const char of optionsStr) {
        if (char === '(') depth++;
        if (char === ')') depth--;
        if (char === ';' && depth === 0) {
          parts.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      if (current.trim()) parts.push(current.trim());

      for (const part of parts) {
        if (part.startsWith('$select=')) {
          opts.select = part.substring(8).split(',').map(f => f.trim());
        } else if (part.startsWith('$expand=')) {
          opts.expand = part.substring(8);
        }
      }

      //console.log("⚙️  Parsed options:", opts);
      return opts;
    }

    // Aplica $select a una entidad
    function applySelect(entity, selectFields) {
      if (!entity || !selectFields || selectFields.length === 0) return entity;
      const result = {};
      selectFields.forEach(field => {
        if (entity.hasOwnProperty(field)) {
          result[field] = entity[field];
        }
      });
      return result;
    }

    // Expande una entidad recursivamente
    function expandProperty(item, property, options) {
      //console.log(`🔄 Expanding ${property} with options:`, options);

      const opts = parseOptions(options);
      let entity = null;

      // Buscar la entidad relacionada
      switch (property) {
        case "Empleado":
          entity = allEntities.Empleados.find(e => e.id === item.empleadoId);
          break;
        case "Cliente":
          entity = allEntities.Clientes.find(c => c.id === item.clienteId);
          break;
        case "Persona":
          entity = allEntities.Personas.find(p =>
            p.id === item.personaId ||
            p.id === item.empleadoId ||
            p.id === item.clienteId ||
            p.id === item.id
          );
          break;
        case "TipoDocumento":
          entity = allEntities.TipoDocumentos.find(t =>
            String(t.id) === String(item.tipoDocumentoId)
          );
          break;
        case "Producto":
        case "Productos":
          if (item.productoId) {
            entity = allEntities.Productos.find(p => p.id === item.productoId);
          } else if (item.productoIds && Array.isArray(item.productoIds)) {
            entity = item.productoIds
              .map(id => allEntities.Productos.find(p => p.id === id))
              .filter(Boolean);
          }
          break;
        case "Ventas":
          entity = allEntities.Ventas.filter(v =>
            v.clienteId === item.id || v.empleadoId === item.id
          );
          break;
      }

      if (!entity) {
        //console.log(`⚠️  Entity ${property} not found`);
        return null;
      }

      //console.log(`✅ Found ${property}:`, entity);

      // Aplicar $select si existe
      if (opts.select) {
        if (Array.isArray(entity)) {
          entity = entity.map(e => applySelect(e, opts.select));
        } else {
          entity = applySelect(entity, opts.select);
        }
      }

      // Aplicar $expand anidado si existe
      if (opts.expand) {
        const nestedExpands = parseExpand(opts.expand);
        if (Array.isArray(entity)) {
          entity = entity.map(e => {
            const expanded = { ...e };
            for (const nested of nestedExpands) {
              const nestedResult = expandProperty(e, nested.property, nested.options);
              if (nestedResult !== null) {
                expanded[nested.property] = nestedResult;
              }
            }
            return expanded;
          });
        } else {
          for (const nested of nestedExpands) {
            const nestedResult = expandProperty(entity, nested.property, nested.options);
            if (nestedResult !== null) {
              entity = { ...entity, [nested.property]: nestedResult };
            }
          }
        }
      }

      return entity;
    }

    // Aplicar expansión a todos los items
    const expandParts = parseExpand(query.$expand);
    data = data.map(item => {
      const expanded = { ...item };
      for (const part of expandParts) {
        const result = expandProperty(item, part.property, part.options);
        if (result !== null) {
          expanded[part.property] = result;
        }
      }
      return expanded;
    });
  }

  // $select (aplicar después del expand)
  if (query.$select) {
    const fields = query.$select.split(",").map(f => f.trim());
    data = data.map(item => {
      const selected = {};
      fields.forEach(f => {
        if (item.hasOwnProperty(f)) {
          selected[f] = item[f];
        }
      });
      return selected;
    });
  }

  // $count
  const response = { value: data };
  if (query.$count === "true") {
    response["@odata.count"] = data.length;
  }

  res.json(response);
});

// --- esto permite usarlo en ambos casos ---
if (process.env.NODE_ENV !== "test" && process.argv[1].includes("server.js")) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Mock OData corriendo en http://localhost:${PORT}`));
}

export default app;