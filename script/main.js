let draggedElement = null;
let originalPositions = new Map();  
let answers = {};

// FUNCIÓN para mezclar un array (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Obtener todos los elementos .draggable
let draggables = Array.from(document.querySelectorAll('.draggable'));

// Guardar el contenedor original de cada draggable
draggables.forEach(draggable => {
    originalPositions.set(draggable, draggable.parentElement);
});

// MEZCLAR los elementos
shuffleArray(draggables);

// Limpiar los contenedores originales
let dragContainers = new Set();
originalPositions.forEach(container => dragContainers.add(container));
dragContainers.forEach(container => container.innerHTML = '');

// Volver a insertar los elementos mezclados en sus contenedores originales
draggables.forEach(draggable => {
    let originalContainer = originalPositions.get(draggable);
    originalContainer.appendChild(draggable);
});

// Asignar eventos a los elementos mezclados
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', handleDragStart);
    draggable.addEventListener('dragend', handleDragEnd);
});

// AÑADIMOS letter__container aquí para permitir soltar en él
document.querySelectorAll('.dropzone, .drag-container, .letter__container').forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
});

function handleDragStart(event) {
    draggedElement = event.target;
    draggedElement.classList.add('dragging');
}

function handleDragEnd() {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement = null;
    }
}

function handleDragOver(event) {
    event.preventDefault(); // Importante para permitir soltar
}

function handleDrop(event) {
    event.preventDefault();
    const dropzone = event.target.closest('.dropzone, .drag-container, .letter__container');

    if (!dropzone) return;

    const draggedOrder = draggedElement.getAttribute('data-order');

    if (dropzone.classList.contains('dropzone')) {
        if (!dropzone.contains(draggedElement)) {
            if (dropzone.children.length > 0) {
                const existingElement = dropzone.querySelector('.draggable');
                const original = originalPositions.get(existingElement);
                if (original) original.appendChild(existingElement);
                delete answers[dropzone.getAttribute('data-correct-order')];
            }

            dropzone.appendChild(draggedElement);

            const correctOrder = dropzone.getAttribute('data-correct-order');
            answers[correctOrder] = draggedOrder;
        }
    } else if (
        dropzone.classList.contains('drag-container') ||
        dropzone.classList.contains('letter__container')
    ) {
        const originalPosition = originalPositions.get(draggedElement) || dropzone;
        originalPosition.appendChild(draggedElement);

        Object.keys(answers).forEach(key => {
            if (answers[key] === draggedOrder) {
                delete answers[key];
            }
        });
    }
}

// Verificación por estrofa
document.querySelectorAll('.verify__estrofa').forEach(button => {
    button.addEventListener('click', function () {
        let estrofaNumber = this.getAttribute('data-estrofa');
        let correctAnswers = 0;

        document.querySelectorAll(`.group__answer[data-estrofa="${estrofaNumber}"] .dropzone`).forEach(dropzone => {
            const correctOrder = dropzone.getAttribute('data-correct-order');
            const draggedOrder = answers[correctOrder];

            if (correctOrder === draggedOrder) {
                dropzone.style.backgroundColor = 'rgba(7, 236, 7, 0.363)';
                correctAnswers++;
            } else {
                dropzone.style.backgroundColor = '#ec121280';
            }
        });
    });
});

// Verificación total
document.getElementById('verify-button').addEventListener('click', function () {
    let correctAnswers = 0;
    let totalQuestions = document.querySelectorAll('.dropzone').length;

    document.querySelectorAll('.dropzone').forEach(dropzone => {
        const correctOrder = dropzone.getAttribute('data-correct-order');
        const draggedOrder = answers[correctOrder];

        if (correctOrder === draggedOrder) {
            dropzone.style.backgroundColor = 'rgba(7, 236, 7, 0.363)';
            correctAnswers++;
        } else {
            dropzone.style.backgroundColor = '#ec121280';
        }
    });

    let score = correctAnswers * 100;
    document.getElementById('score').textContent = `Score: ${score.toFixed(0)} pts`;
});

// Reset
document.getElementById('reset-button').addEventListener('click', function () {
    originalPositions.forEach((container, draggable) => {
        container.appendChild(draggable);
    });

    document.querySelectorAll('.dropzone').forEach(dropzone => {
        dropzone.innerHTML = '';
        dropzone.style.backgroundColor = 'transparent';
    });

    answers = {};
    document.getElementById('score').textContent = 'Score: 0 pts';
});
