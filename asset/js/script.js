const input = document.querySelector('.input');
const button = document.querySelector('.btn');
const select = document.querySelector('.select');
const span = document.querySelector('.resultado');
const canvas = document.querySelector('.grafico');

const url = "https://mindicador.cl/api";

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return `${day}/${month}/${year}`;
}

function renderGrafico(data) {
    console.log(data)
    const config = {
        type: "line",
        data: {
            labels: data.map((elem) => formatDate(new Date(elem.fecha))
            ),
            datasets: [{
                label: "Ultimos 10 dias",
                backgroundColor: "red",
                data: data.map((elem) => elem.valor
                ),
            }]
        }
    }
    canvas.style.backgroundColor = "white";
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(canvas, config);
    document.getElementById('graficaContenedor').style.display = 'block';
}

let myChart = null;
async function buscarCotizacion() {
    try {
        const cantidad = input.value;
        const moneda = select.value;
        const fetching = await fetch(`${url}/${moneda}`);
        const data = await fetching.json();
        return data;
    } catch (error) {
        console.log(error);
        span.innerHTML = "Ocurrio un error";
    }
}


button.addEventListener('click', async () => {
    try {
        span.innerHTML = `Cargando...`;

        const result = await buscarCotizacion();
        if (!result || !result.serie || result.serie.length === 0) {
            throw new Error('No se encontraron datos');
        }

        const serie = result.serie;
        const lastValue = serie[0].valor;
        const data = serie.slice(0, 10).reverse(); // Obtener los 10 últimos valores de la serie
        span.innerHTML = `Resultado: $${lastValue}`;

        renderGrafico(data);
    } catch (error) {
        console.error(error);
        span.innerHTML = "Ocurrió un error al buscar la cotización";
    }
});



