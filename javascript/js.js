let dailyProgress = JSON.parse(localStorage.getItem('dailyProgress')) || [];
let selectedDay = null;

// Elegir el día de entrenamiento
function chooseDay(day) {
    selectedDay = day;
    document.getElementById('exercise-form').style.display = 'block';
    document.getElementById('progress-list').innerHTML = '';
    loadExercisesForDay();
}

// Guardar el ejercicio realizado
function saveExercise() {
    const exercise = document.getElementById('exercise').value;
    const series = document.getElementById('series').value;
    const reps = document.getElementById('reps').value;
    const weight = document.getElementById('weight').value;

    if (!exercise || !series || !reps || !weight) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const newEntry = {
        day: selectedDay,
        exercise: exercise,
        series: series,
        reps: reps,
        weight: weight,
        date: new Date().toLocaleDateString()
    };

    dailyProgress.push(newEntry);
    localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress));
    loadExercisesForDay();
    clearInputs();
}

// Mostrar los ejercicios realizados del día seleccionado
// Mostrar los ejercicios realizados del día seleccionado con un botón de borrar
function loadExercisesForDay() {
    const progressList = document.getElementById('progress-list');
    progressList.innerHTML = '';

    dailyProgress.filter(entry => entry.day === selectedDay).forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${entry.date} - ${entry.exercise}: ${entry.series} series de ${entry.reps} repeticiones, ${entry.weight} kg`;

        // Crear botón de borrar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Borrar';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = () => deleteEntry(index);

        // Agregar el botón de borrar al lado del ejercicio
        li.appendChild(deleteButton);
        progressList.appendChild(li);
    });
}

// Eliminar un ejercicio
function deleteEntry(index) {
    // Eliminar la entrada seleccionada de dailyProgress
    dailyProgress.splice(index, 1);
    // Guardar el nuevo arreglo de ejercicios en localStorage
    localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress));

    // Actualizar la lista de ejercicios mostrados
    loadExercisesForDay();
}


// Mostrar gráfico de progreso mensual
function showMonthlyProgress() {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.innerHTML = '';

    const labels = [];
    const data = [];

    const monthlyData = dailyProgress.reduce((acc, entry) => {
        if (!acc[entry.exercise]) {
            acc[entry.exercise] = [];
        }
        acc[entry.exercise].push({ weight: parseFloat(entry.weight), date: entry.date });
        return acc;
    }, {});

    for (const [exercise, records] of Object.entries(monthlyData)) {
        const avgWeight = records.reduce((sum, record) => sum + record.weight, 0) / records.length;
        labels.push(exercise);
        data.push(avgWeight);
    }

    const chart = new Chart(chartContainer, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Promedio de Peso',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Limpiar los campos de entrada
function clearInputs() {
    document.getElementById('exercise').value = '';
    document.getElementById('series').value = '';
    document.getElementById('reps').value = '';
    document.getElementById('weight').value = '';
}
