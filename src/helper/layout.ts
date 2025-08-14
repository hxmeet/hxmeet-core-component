import type {LayoutStyleItem} from "../types/conference";

export const calcCircleLayout = (index: number, total: number, canvasWidth: number, canvasHeight: number): LayoutStyleItem => {
    const divideList = [
        1.5,   // 1
        2.2,   // 2
        2.5,   // 3
        2.9,   // 4
        3.0,   // 5
        3.3,   // 6
        3.6,   // 7
        3.9,   // 8
        4.3,   // 9
        4.8,   // 10
        5.0,   // 11
        5.5,   // 12
        6.0,   // 13
        6.1,   // 14
        6.2    // 15
    ]
    const divideBaseForMoreParticipants = 6.2

    let containerSize, leftMove, topMove;
    if (canvasWidth < canvasHeight) {
        containerSize = canvasWidth;
        leftMove = 0;
        topMove = (canvasHeight - containerSize) / 2;
    } else {
        containerSize = canvasHeight;
        leftMove = (canvasWidth - containerSize) / 2;
        topMove = 0;
    }

    // const divide = divideList.length > total ? divideList[total - 1] : divideBaseForMoreParticipants + (total - divideList.length + 1) * 0.2;
    let divide = divideList[total - 1] ?? -1
    if (divide === -1) {
        // Calculate divide for higher participant counts
        divide = divideBaseForMoreParticipants + (total - divideList.length + 1) * 0.2;
    }
    const videoSize = Math.round(containerSize / divide);

    const padding = 10; // Ein zusätzlicher Abstand vom Rand des Containers

    // Der effektive Radius, der die Größe des Videos und den Padding berücksichtigt
    const effectiveRadius = (containerSize / 2) - videoSize / 2 - padding;

    const angle = (2 * Math.PI) / total * index;
    let x = Math.cos(angle) * effectiveRadius + (containerSize / 2) - (videoSize / 2);
    let y = Math.sin(angle) * effectiveRadius + (containerSize / 2) - (videoSize / 2);

    if (total === 1) {
        x = (containerSize - videoSize) / 2;
        y = x;
    }

    return {
        container: {
            position: 'absolute',
            left: `${x + leftMove}px`,
            top: `${y + topMove}px`,
            width: `${videoSize}px`,
            height: `${videoSize}px`,
        },
        videoElement: {
            borderRadius: `${videoSize}px`,
        }
    };
}

export const calcGridLayout = (index: number, total: number, canvasWidth: number, canvasHeight: number): LayoutStyleItem => {
    // Calculate the padding as a percentage of the canvas dimensions
    const canvasPadding = Math.min(canvasWidth, canvasHeight) * 0.05; // 5% of the smaller dimension
    const elementPadding = Math.min(canvasWidth, canvasHeight) * 0.01; // 1% of the smaller dimension
    const maxSize = 500;

    // Subtract the padding from the canvas dimensions
    const adjustedWidth = canvasWidth - 2 * canvasPadding;
    const adjustedHeight = canvasHeight - 2 * canvasPadding;

    // Calculate the aspect ratio of the canvas
    const aspectRatio = adjustedWidth / adjustedHeight;

    let columns, rows;

    if (Math.sqrt(total) % 1 === 0) {
        // If the total number of elements is a perfect square, use the square root as the number of columns and rows
        columns = Math.sqrt(total);
        rows = Math.sqrt(total);
    } else {
        // Calculate the number of columns and rows for the grid based on the aspect ratio
        columns = Math.round(Math.sqrt(total * aspectRatio));
        if (total % columns <= 2 && total > 8) columns--;
        rows = Math.ceil(total / columns);

    }

    // Calculate the size of each element, based on the smaller dimension of the adjusted canvas
    // Subtract the element padding from the size
    const size = Math.min(Math.min(adjustedWidth / columns, adjustedHeight / rows) - elementPadding, maxSize);

    // Calculate the total width and height of the grid
    const totalWidth = columns * (size + elementPadding);
    const totalHeight = rows * (size + elementPadding);

    // Calculate the starting point for the grid to center it on the adjusted canvas
    const startX = (adjustedWidth - totalWidth) / 2 + canvasPadding;
    const startY = (adjustedHeight - totalHeight) / 2 + canvasPadding;

    // Calculate the number of elements in the last row
    const lastRowElements = total % columns;

    let lastRowPadding = 0;
    if (lastRowElements !== 0) {
        // Calculate the total width of the elements in the last row
        const lastRowWidth = lastRowElements * (size + elementPadding);

        // Calculate the additional padding needed to center the elements in the last row
        lastRowPadding = (totalWidth - lastRowWidth) / 2;
    }

    // Calculate the position of the current element within the grid
    let x = (index % columns) * (size + elementPadding) + startX;
    const y = Math.floor(index / columns) * (size + elementPadding) + startY;

    // If the element is in the last row and the last row is not completely filled, add the additional padding to the X position
    if (lastRowElements !== 0 && Math.floor(index / columns) === rows - 1) x += lastRowPadding;

    return {
        container: {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${size}px`,
            height: `${size}px`,
        },
        videoElement: {
            borderRadius: '5%'
        }
    };
}

export const calcCinemaLayout = (index: number, total: number, canvasWidth: number, canvasHeight: number): LayoutStyleItem => {
    // 2/3 of the canvas height is used for the video / presented media
    const topPadding = canvasHeight * 4 / 5;
    // The canvas height is reduced to 1/3 of the available height
    canvasHeight = canvasHeight / 5;

    // Calculate the padding as a percentage of the canvas dimensions
    const canvasPadding = Math.min(canvasWidth, canvasHeight) * 0.075; // 7.5% of the smaller dimension
    const elementPadding = Math.min(canvasWidth, canvasHeight) * 0.02; // 2% of the smaller dimension
    const maxSize = 350;

    // Subtract the padding from the canvas dimensions
    const adjustedWidth = canvasWidth - 2 * canvasPadding;
    const adjustedHeight = canvasHeight - 2 * canvasPadding;

    // Calculate the aspect ratio of the canvas
    const aspectRatio = adjustedWidth / adjustedHeight;

    // let rows = Math.ceil(total / Math.floor(aspectRatio));
    let rows = 1;
    while (total > rows * rows * Math.floor(aspectRatio)) {
        rows++;
    }
    // Calculate the size of each element, based on the smaller dimension of the adjusted canvas
    const size = Math.min(adjustedHeight / rows - elementPadding, maxSize);
    let columns = Math.ceil(total / rows);

    // Calculate the total width and height of the grid
    const totalWidth = columns * (size + elementPadding);
    const totalHeight = rows * (size + elementPadding);

    // Calculate the starting point for the grid to center it on the adjusted canvas
    const startX = (adjustedWidth - totalWidth) / 2 + canvasPadding;
    const startY = (adjustedHeight - totalHeight) / 2 + canvasPadding + topPadding;

    // Calculate the number of elements in the first row
    const firstRowElements = total % columns === 0 ? columns : columns - 1;
    const lastRowElements = total % columns;

    let firstRowPadding = 0;
    if (firstRowElements !== columns) {
        // Calculate the total width of the elements in the first row
        const firstRowWidth = firstRowElements * (size + elementPadding);
        firstRowPadding = (totalWidth - firstRowWidth) / 2;
    }

    let x,y;
    // Calculate the position of the current element within the grid
    if (firstRowElements === columns - 1) {
        if (index <= firstRowElements - 1) {
            x = (index % columns) * (size + elementPadding) + startX + firstRowPadding;
            y = Math.floor(index / columns) * (size + elementPadding) + startY;
        } else {
            x = ((index + 1) % columns) * (size + elementPadding) + startX;
            y = Math.floor((index + 1) / columns) * (size + elementPadding) + startY;
        }
        const lastRowElements = (total + 1) % columns;
        if (lastRowElements !== 0 && Math.floor((index + 1) / columns) === rows - 1) x += firstRowPadding;
    } else {
        x = (index % columns) * (size + elementPadding) + startX;
        y = Math.floor(index / columns) * (size + elementPadding) + startY;
    }

    return {
        container: {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${size}px`,
            height: `${size}px`
        },
        videoElement: {
            borderRadius: `${size}px`,
        }
    };
}
