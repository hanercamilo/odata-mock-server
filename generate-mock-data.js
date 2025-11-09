import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helpers
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[random(0, arr.length - 1)];
const randomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};

// Data generators
const nombres = [
    "Juan", "María", "Carlos", "Ana", "Luis", "Carmen", "Pedro", "Laura", "Diego", "Sofía",
    "Miguel", "Isabel", "Javier", "Patricia", "Fernando", "Lucía", "Roberto", "Elena", "Alberto", "Marta",
    "Ricardo", "Rosa", "Antonio", "Beatriz", "Francisco", "Teresa", "Ramón", "Cristina", "Manuel", "Silvia",
    "José", "Pilar", "Ángel", "Mercedes", "Rafael", "Gloria", "Enrique", "Victoria", "Andrés", "Dolores",
    "Pablo", "Raquel", "Jorge", "Amparo", "Sergio", "Inmaculada", "Iván", "Concepción", "Rubén", "Rocío",
    "Alejandro", "Nuria", "David", "Sandra", "Daniel", "Mónica", "Adrián", "Yolanda", "Víctor", "Natalia",
    "Óscar", "Susana", "Álvaro", "Verónica", "Marcos", "Marina", "Raúl", "Carolina", "Eduardo", "Lorena",
    "César", "Alicia", "Hugo", "Eva", "Gonzalo", "Irene", "Ignacio", "Paula", "Guillermo", "Andrea",
    "Samuel", "Claudia", "Nicolás", "Julia", "Jaime", "Miriam", "Mario", "Alba", "Lucas", "Sara",
    "Gabriel", "Clara", "Mateo", "Daniela", "Martín", "Valentina", "Leo", "Emma", "Bruno", "Olivia",
    "Izan", "Carla", "Oliver", "Valeria", "Erik", "Martina", "Marc", "Lucía", "Alex", "Noa",
    "Camilo", "Luna", "Simón", "María", "Thiago", "Abril", "Liam", "Ana", "Noah", "Sofía",
    "Dylan", "Isabella", "Ian", "Mía", "Gael", "Alma", "Iker", "Victoria", "Darío", "Helena",
    "Sebastián", "Emma", "Rodrigo", "Catalina", "Emilio", "Jimena", "Joaquín", "Renata", "Lorenzo", "Fernanda",
    "Tomás", "Gabriela", "Felipe", "Mariana", "Agustín", "Valentina", "Benjamín", "Regina", "Santiago", "Camila",
    "Maximiliano", "Ximena", "Leonardo", "Paulina", "Matías", "Adriana", "Emanuel", "Alejandra", "Cristóbal", "Daniela",
    "Valentín", "Nicole", "Santino", "Natalia", "Lautaro", "Diana", "Facundo", "Paola", "Bautista", "Verónica",
    "Dante", "Cecilia", "Franco", "Liliana", "Thiago", "Marcela", "Milton", "Soledad", "Germán", "Beatriz",
    "Julián", "Graciela", "Esteban", "Mónica", "Armando", "Norma", "Héctor", "Silvia", "Gustavo", "Margarita",
    "Mauricio", "Luz", "Orlando", "Esperanza", "Rodrigo", "Paz", "Ezequiel", "Angélica", "Salvador", "Amparo"
];

const apellidos = [
    "García", "Rodríguez", "Martínez", "López", "González", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores",
    "Rivera", "Gómez", "Díaz", "Cruz", "Morales", "Reyes", "Gutiérrez", "Ortiz", "Chávez", "Ruiz",
    "Hernández", "Jiménez", "Mendoza", "Castillo", "Vargas", "Romero", "Álvarez", "Castro", "Medina", "Guerrero"
];

const ciudades = [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira",
    "Santa Marta", "Ibagué", "Manizales", "Neiva", "Villavicencio", "Armenia", "Valledupar", "Montería",
    "Sincelejo", "Popayán", "Pasto", "Tunja", "Florencia", "Riohacha", "Quibdó", "Leticia"
];

const cargos = [
    "Desarrollador Senior", "Desarrollador Junior", "Arquitecto de Software", "DevOps Engineer",
    "Analista de Datos", "Científico de Datos", "Ingeniero de Machine Learning", "Administrador de Sistemas",
    "Gerente de Proyectos", "Product Owner", "Scrum Master", "QA Tester", "QA Automation",
    "Diseñador UX/UI", "Diseñador Gráfico", "Community Manager", "Especialista SEO", "Content Manager",
    "Analista de Marketing", "Gerente de Marketing", "Ejecutivo de Ventas", "Gerente Comercial",
    "Contador", "Auditor", "Analista Financiero", "Tesorero", "Controller Financiero",
    "Analista de Recursos Humanos", "Reclutador", "Gerente de RRHH", "Especialista en Nómina",
    "Abogado Corporativo", "Asistente Legal", "Coordinador Administrativo", "Asistente Ejecutivo",
    "Ingeniero Civil", "Arquitecto", "Ingeniero Industrial", "Ingeniero Eléctrico",
    "Médico", "Enfermero", "Terapeuta", "Nutricionista", "Psicólogo"
];

const areas = [
    "Tecnología", "Desarrollo", "Infraestructura", "Seguridad Informática",
    "Marketing", "Publicidad", "Comunicaciones", "Diseño",
    "Ventas", "Comercial", "Atención al Cliente", "Soporte",
    "Finanzas", "Contabilidad", "Tesorería", "Auditoría",
    "Recursos Humanos", "Talento Humano", "Capacitación",
    "Legal", "Jurídico", "Compliance",
    "Administración", "Operaciones", "Logística",
    "Ingeniería", "Producción", "Calidad",
    "Salud", "Bienestar", "Prevención"
];

const empresas = [
    "Tech Solutions", "Innovatech", "Digital Corp", "Smart Systems", "Cloud Services",
    "Data Analytics", "AI Solutions", "Cyber Security", "Web Masters", "App Developers",
    "Marketing Pro", "Brand Builders", "Media Group", "Creative Studio", "Design House",
    "Sales Force", "Commerce Plus", "Trade Solutions", "Business Partners", "Global Sales",
    "Finance Corp", "Accounting Services", "Tax Advisors", "Audit Partners", "Capital Group",
    "HR Solutions", "Talent Finders", "Recruiting Pro", "People First", "Workforce Management",
    "Legal Associates", "Law Partners", "Justice Group", "Rights Defenders", "Legal Advisors",
    "Construction Co", "Engineering Works", "Build Masters", "Infrastructure Inc", "Projects Group",
    "Health Care", "Medical Services", "Wellness Center", "Clinic Plus", "Hospital Group",
    "Logistics Express", "Transport Solutions", "Cargo Masters", "Delivery Pro", "Supply Chain"
];

const productos = [
    { cat: "Computadores", items: ["Laptop HP", "Laptop Dell", "Laptop Lenovo", "MacBook Pro", "MacBook Air", "iMac", "PC Gamer", "Workstation"] },
    { cat: "Monitores", items: ["Monitor Samsung 24\"", "Monitor LG 27\"", "Monitor Dell UltraSharp", "Monitor Asus Gaming", "Monitor BenQ", "Monitor AOC"] },
    { cat: "Periféricos", items: ["Mouse Logitech", "Mouse Razer", "Teclado Mecánico", "Teclado Inalámbrico", "Webcam HD", "Audífonos Gaming", "Micrófono USB"] },
    { cat: "Almacenamiento", items: ["Disco SSD 500GB", "Disco SSD 1TB", "Disco HDD 2TB", "Memoria USB 64GB", "Tarjeta SD 128GB", "NAS 4TB"] },
    { cat: "Networking", items: ["Router WiFi 6", "Switch 24 puertos", "Access Point", "Firewall", "Módem Fibra", "Cable Cat6"] },
    { cat: "Oficina", items: ["Silla Ergonómica", "Escritorio Ajustable", "Lámpara LED", "Organizador", "Soporte Monitor", "Reposapiés"] },
    { cat: "Impresión", items: ["Impresora Láser", "Impresora Multifuncional", "Scanner", "Plotter", "Tóner Negro", "Papel Carta"] },
    { cat: "Software", items: ["Licencia Office 365", "Licencia Windows", "Adobe Creative Cloud", "Antivirus", "VPN Premium", "Backup Cloud"] },
    { cat: "Servidores", items: ["Servidor Rack 1U", "Servidor Torre", "UPS 1500VA", "PDU Rack", "Gabinete 42U", "Patch Panel"] },
    { cat: "Smartphones", items: ["iPhone 15", "Samsung Galaxy S24", "Xiaomi Redmi", "Motorola Edge", "OnePlus 12", "Google Pixel"] }
];

// Generate TipoDocumentos (4 registros fijos, no cambian)
const tipoDocumentos = [
    { id: 1, codigo: "CC", descripcion: "Cédula de Ciudadanía" },
    { id: 2, codigo: "TI", descripcion: "Tarjeta de Identidad" },
    { id: 3, codigo: "CE", descripcion: "Cédula de Extranjería" },
    { id: 4, codigo: "NIT", descripcion: "Número de Identificación Tributaria" }
];

// Generate Personas (200)
const personas = [];
for (let i = 1; i <= 200; i++) {
    personas.push({
        id: i,
        tipoDocumentoId: i <= 180 ? 1 : random(1, 3), // Mayoría CC
        numeroDocumento: String(random(10000000, 99999999)),
        nombre: `${randomItem(nombres)} ${randomItem(apellidos)}`,
        edad: random(18, 65),
        correo: `persona${i}@mail.com`
    });
}

// Generate Empleados (200, usan personaId 1-200)
const empleados = [];
for (let i = 1; i <= 200; i++) {
    empleados.push({
        id: i,
        personaId: i,
        cargo: randomItem(cargos),
        salario: random(2000000, 12000000),
        area: randomItem(areas)
    });
}

// Generate Clientes (250, todos con NIT)
const clientes = [];
for (let i = 1; i <= 250; i++) {
    const esEmpresa = i % 4 === 0; // 25% empresas
    clientes.push({
        id: i,
        nombre: esEmpresa ? `${randomItem(empresas)} ${randomItem(["SAS", "S.A.", "LTDA", "E.U."])}` : `${randomItem(nombres)} ${randomItem(apellidos)}`,
        nit: `90${random(1000000, 9999999)}`,
        ciudad: randomItem(ciudades),
        contacto: esEmpresa ? `contacto@empresa${i}.com` : `cliente${i}@mail.com`
    });
}

// Generate Productos (200)
const productosGenerados = [];
let prodId = 1;
for (let i = 0; i < 25; i++) { // 25 iteraciones para generar 200 productos
    productos.forEach(cat => {
        cat.items.forEach(item => {
            if (prodId <= 200) {
                productosGenerados.push({
                    id: prodId++,
                    nombre: item,
                    categoria: cat.cat,
                    precio: random(50000, 8000000),
                    stock: random(0, 100)
                });
            }
        });
    });
}

// Generate Ventas (250, con relaciones correctas)
const ventas = [];
const startDate = new Date(2024, 0, 1);
const endDate = new Date(2025, 11, 31);

for (let i = 1; i <= 250; i++) {
    const cantidad = random(1, 10);
    const productoId = random(1, 200);
    const precio = productosGenerados.find(p => p.id === productoId)?.precio || 1000000;

    ventas.push({
        id: i,
        clienteId: random(1, 250),
        productoId: productoId,
        empleadoId: random(1, 200),
        fecha: randomDate(startDate, endDate),
        cantidad: cantidad,
        total: precio * cantidad
    });
}

// Write files
const outputDir = path.join(__dirname, 'data', 'entities');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'TipoDocumentos.json'), JSON.stringify(tipoDocumentos, null, 2));
fs.writeFileSync(path.join(outputDir, 'Personas.json'), JSON.stringify(personas, null, 2));
fs.writeFileSync(path.join(outputDir, 'Empleados.json'), JSON.stringify(empleados, null, 2));
fs.writeFileSync(path.join(outputDir, 'Clientes.json'), JSON.stringify(clientes, null, 2));
fs.writeFileSync(path.join(outputDir, 'Productos.json'), JSON.stringify(productosGenerados, null, 2));
fs.writeFileSync(path.join(outputDir, 'Ventas.json'), JSON.stringify(ventas, null, 2));

console.log('✅ Mock data generated successfully!');
console.log(`📊 Statistics:`);
console.log(`   - TipoDocumentos: ${tipoDocumentos.length}`);
console.log(`   - Personas: ${personas.length}`);
console.log(`   - Empleados: ${empleados.length}`);
console.log(`   - Clientes: ${clientes.length}`);
console.log(`   - Productos: ${productosGenerados.length}`);
console.log(`   - Ventas: ${ventas.length}`);
console.log(`\n💾 Files saved in: ${outputDir}`);