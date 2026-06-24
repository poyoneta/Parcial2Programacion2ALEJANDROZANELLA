
let cursosSimulados = [
    { Id: 1, Nombre: 'Programación Avanzada con Python', Categoria: 'Tecnología', Duracion: 40, CuposDisponibles: 15, Activo: true },
    { Id: 2, Nombre: 'Introducción al Diseño UX/UI', Categoria: 'Diseño', Duracion: 24, CuposDisponibles: 0, Activo: true },
    { Id: 3, Nombre: 'Base de Datos SQL Server', Categoria: 'Tecnología', Duracion: 32, CuposDisponibles: 20, Activo: true },
    { Id: 4, Nombre: 'Marketing Digital y Redes', Categoria: 'Negocios', Duracion: 20, CuposDisponibles: 12, Activo: false },
    { Id: 5, Nombre: 'Desarrollo Web Frontend', Categoria: 'Tecnología', Duracion: 48, CuposDisponibles: 8, Activo: true }
];

let próximoId = 6;


const getCursos = async (req, res) => {
    try {
        res.json(cursosSimulados);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cursos' });
    }
};


const getCursoById = async (req, res) => {
    try {
        const curso = cursosSimulados.find(c => c.Id === parseInt(req.params.id));
        if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });
        res.json(curso);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el curso' });
    }
};


const createCurso = async (req, res) => {
    try {
        const { Nombre, Categoria, Duracion, CuposDisponibles, Activo } = req.body;
        
        if (!Nombre || !Categoria || Duracion == null || CuposDisponibles == null || Activo == null) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const nuevoCurso = {
            Id: próximoId++,
            Nombre,
            Categoria,
            Duracion: parseInt(Duracion),
            CuposDisponibles: parseInt(CuposDisponibles),
            Activo: Boolean(Activo)
        };

        cursosSimulados.push(nuevoCurso);
        res.status(201).json({ message: 'Curso registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el curso' });
    }
};

const deleteCurso = async (req, res) => {
    try {
        const idOriginal = cursosSimulados.length;
        cursosSimulados = cursosSimulados.filter(c => c.Id !== parseInt(req.params.id));

        if (cursosSimulados.length === idOriginal) {
            return res.status(404).json({ message: 'Curso no encontrado para eliminar' });
        }
        res.json({ message: 'Curso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el curso' });
    }
};

module.exports = {
    getCursos,
    getCursoById,
    createCurso,
    deleteCurso
};