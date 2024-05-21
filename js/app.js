// Variables and Selectors
const formulario = document.querySelector('#agregar-gasto');     
const gastoListado = document.querySelector('#gastos ul');


// Events


eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);    
}


// Classes 
class Presupuesto { 

    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }

}

class UI { 
    insertarPresupuesto(cantidad){
        // Extract values
        const {presupuesto, restante} = cantidad;

        // Add to HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        // Create the div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // If it is an error type, add a class
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Error message
        divMensaje.textContent = mensaje;

        // Insert into the DOM
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // Remove the alert after 3 seconds
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    // Add the expenses to the List
    mostrarGastos(gastos){

        // Clean the HTML
        this.limpiarHTML(); // Clean the HTML before adding the new expenses

        // Iterate over the expenses
        gastos.forEach( gasto => {
            const {nombre, cantidad, id} = gasto;
            // Create li element
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Add the HTML content
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

            // Create delete button
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Delete &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Add to HTML
            gastoListado.appendChild(nuevoGasto);
        })

    }
    
    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // Check 25%
        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.remove('alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Check if the restante is <= 0
        if(restante <= 0){
            ui.imprimirAlerta('Your budget is over', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;
        }   
    }
        
}

// Instantiate
const ui = new UI();
let presupuesto;

// Functions
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('What is your budget?');

    //console.log(Number(presupuestoUsuario));
    // We review the value
    if(presupuestoUsuario === '' || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    // Valid Budget
    presupuesto = new Presupuesto(presupuestoUsuario);

    console.log(presupuesto);
    
    ui.insertarPresupuesto(presupuesto);
}

// Add expenses
function agregarGasto(e){
    e.preventDefault();

    // Read form data
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validate
    if(nombre === '' || cantidad === ''){
        // There was a mistake
        ui.imprimirAlerta('Both fields are required', 'error');
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Invalid amount', 'error');
        return;
    }

    // Generate an object with the expense
    const gasto = {nombre, cantidad, id: Date.now()};

    // Add a new expense
    presupuesto.nuevoGasto(gasto);

    // Show success message
    ui.imprimirAlerta('Expense added correctly');

    // Print the expenses
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    // Clear the form
    formulario.reset();

}

function eliminarGasto(id){
    // Delete the expenses
    presupuesto.eliminarGasto(id);
    // Show success message
    ui.imprimirAlerta('Expense removed correctly');
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
