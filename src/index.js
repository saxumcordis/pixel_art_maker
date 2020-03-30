const colors = [
    "#ff0000", "#ff9b00", "#fbff05", "#2aff00",
    "#0714ff", "#ff00f4"
];

const dimensions = {
    width: 50,
    height: 50
};

const state = {
    paint : {
        activeColor: '#000000',
        painting: false,
        action: 'brush'
    },
    colors,
    grid: initGrid(dimensions)
};

document.addEventListener('DOMContentLoaded', () => {
    const gridView = document.getElementById('grid');
    gridView.innerHTML = createGridView(state).innerHTML;

    const paletteView = document.getElementById('colors');
    paletteView.innerHTML = createPaletteView(state).innerHTML;

    render(state);

    gridView.addEventListener('mousedown', (e) => {
        const cell = e.target.closest('.cell');
        if (!cell) {
            return;
        }
        state.paint.painting = true;
        handleCellAction(cell, state);
        render(state);
    });

    gridView.addEventListener('mouseover', (e) => {
        const cell = e.target.closest('.cell');
        if (!cell || !state.paint.painting) {
            return;
        }
        handleCellAction(cell, state);
        render(state);
    });

    document.addEventListener('mouseup', () => state.paint.painting = false);

    document.getElementById('colors').addEventListener('click', (e) => {
        const color = e.target.closest('div[data-color]')
        if (!color) {
            return;
        }
        state.paint.activeColor = color.getAttribute('data-color');
        renderColorPicker(state.paint);
    });

    document.getElementById('active-color').addEventListener('change', e => {
        state.paint.activeColor = e.target.value;
        console.log(e.target.value)
    });

    document.getElementById('actions').addEventListener('click', e => {
        const actionButton = e.target.closest('a');
        if (!actionButton) {
            return;
        }

        const action = actionButton.getAttribute('data-action');

        if (['brush', 'fill'].includes(action)) {
            state.paint.action = action;
        } else {
            if (action == 'clear') {
                state.grid = initGrid(dimensions);
            }
        }
        render(state);
    });
});

const render = (state) => {
    renderColorPicker(state.paint);
    renderGrid(state);
    renderActions(state);
};

const renderColorPicker = ({activeColor}) => {
    const colorPicker = document.getElementById('active-color');
    colorPicker.value = activeColor;
};

function initGrid({width = 16, height = 9}, defaultColor = '#FFFFFF') {
    const grid = []
    for (let r = 0; r < height; r++) {
        const row = []
        for (let c = 0; c < width; c++) {
            row.push(defaultColor);
        }
        grid.push(row);
    }
    return grid;
}

const createGridView = ({grid}) => {
    const gridView = document.createElement('div');
    for (let r = 0; r < grid.length; r++) {
        const row = document.createElement('div');
        row.classList = 'row';
        for (let c = 0; c < grid[r].length; c++) {
            const cell = document.createElement('div');
            cell.classList = 'cell';
            cell.setAttribute('data-row', r);
            cell.setAttribute('data-col', c);
            row.append(cell);
        }
        gridView.append(row);
    }

    return gridView;
}

const createPaletteView = ({colors = []}) => {
    const palette = document.createElement('div');

    for (const color of colors) {
        const colorPicker = document.createElement('div');
        colorPicker.style.backgroundColor = color;
        colorPicker.setAttribute('data-color', color);

        palette.append(colorPicker);
    }
    return palette;
}

const renderGrid = ({grid}) => {
    const gridView = document.getElementById('grid');
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            gridView.children[row].children[col].style.backgroundColor = grid[row][col]
        }
    }
}

const handleCellAction = (cell, {paint, grid}) => {
    const row = +cell.getAttribute('data-row');
    const col = +cell.getAttribute('data-col');
    if (paint.action == 'brush') {
        grid[row][col] = paint.activeColor;
    }
    if (paint.action == 'fill') {
        fill();
    }
};

const fill = () => {
   state.grid = initGrid(dimensions, state.paint.activeColor);
};



const renderActions = ({paint}) => {
    const prevActiveAction = document.getElementsByClassName('action-button__active');
    prevActiveAction[0].classList.remove('action-button__active');
    document.querySelector(`[data-action=${paint.action}]`).classList.add('action-button__active')
}