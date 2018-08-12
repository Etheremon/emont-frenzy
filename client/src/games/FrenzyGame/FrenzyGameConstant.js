export const NUM_ROWS = 100;
export const NUM_COLS = 15;

export const IMG_FISH_SIZE = {w: 512, h: 512};
export const IMG_CELL_SIZE = {w: 256, h: 256};

export const WORLD_WIDTH = 1400;
export const BOARD_MARGIN = {x: 40, y: 1000};
export const BOARD_WIDTH = WORLD_WIDTH - BOARD_MARGIN.x * 2;
export const CELL_WIDTH = BOARD_WIDTH / NUM_COLS;
export const WORLD_HEIGHT = BOARD_MARGIN.y + NUM_ROWS * CELL_WIDTH + 300;


export const SIZE_OF_BODY_BG = {w: 1080, h: 2347};
export const OFFSET_BODY_BG = {x: 0, y: 350};
export const OFFSET_FOOTER_BG = {x: 0, y: 200};

export const BG_TOP_SIZE = {w: 1400, h: 1692};
export const BG_BOTTOM_SIZE = {w: 1400, h: 2152};
export const NUMBER_OF_FISH = 5;