const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

router.get('/', cursoController.getCursos);
router.get('/:id', cursoController.getCursoById);
router.post('/', cursoController.createCurso);
router.delete('/:id', cursoController.deleteCurso);

module.exports = router;