const { poolPromise, sql } = require('../config/db');

const getCursos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Cursos');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cursos', error: error.message });
    }
};

const getCursoById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Cursos WHERE Id = @id');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }
        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el curso', error: error.message });
    }
};

const createCurso = async (req, res) => {
    try {
        const { Nombre, Categoria, Duracion, CuposDisponibles, Activo } = req.body;
        
     
        if (!Nombre || !Categoria || Duracion == null || CuposDisponibles == null || Activo == null) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const pool = await poolPromise;
        await pool.request()
            .input('Nombre', sql.NVarChar(100), Nombre)
            .input('Categoria', sql.NVarChar(100), Categoria)
            .input('Duracion', sql.Int, Duracion)
            .input('CuposDisponibles', sql.Int, CuposDisponibles)
            .input('Activo', sql.Bit, Activo)
            .query(`INSERT INTO Cursos (Nombre, Categoria, Duracion, CuposDisponibles, Activo) 
                    VALUES (@Nombre, @Categoria, @Duracion, @CuposDisponibles, @Activo)`);

        res.status(201).json({ message: 'Curso registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el curso', error: error.message });
    }
};

const deleteCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Cursos WHERE Id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Curso no encontrado para eliminar' });
        }
        res.json({ message: 'Curso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el curso', error: error.message });
    }
};

module.exports = {
    getCursos,
    getCursoById,
    createCurso,
    deleteCurso
};