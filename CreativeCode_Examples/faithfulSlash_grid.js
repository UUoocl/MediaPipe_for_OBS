class Grid {
    constructor() {
      this.grid = [];
      for (let i=0; i<cols; i++) {
        this.grid[i] = [];
        for (let j=0; j<rows; j++) {
          this.grid[i][j] = 0;
        }
      }
    }
    
    display() {
       
      for (let i=0; i<cols; i++) {
        for (let j=0; j<rows; j++) {
          if(this.grid[i][j] == 0) {
            if (play) {
              fill(360,0,0,0);
            } else {
              fill(0);
            }
            
          } else {
            fill(hueValue, 255, 255);
          } 
          noStroke();
          rect(i*size, j*size, size, size);
        }
      }    
    }
    
    update() {
      let next = [];
      for (let i=0; i<cols; i++) {
        next[i] = [];
        for (let j=0; j<rows; j++) {
          
          let sum = this.sumNeighbors(this.grid, i, j)
          if (this.grid[i][j] == 1 && sum < 2) {
            next[i][j] = 0;
          } else if (this.grid[i][j] == 1 && (sum == 2 || sum == 3)){
            next[i][j] = 1;
          } else if (this.grid[i][j] == 1 && sum > 3) {
            next[i][j] = 0;
          } else if (this.grid[i][j] == 0 && sum == 3) {
            next[i][j] = 1;
          } else {
            next[i][j] = this.grid[i][j];
          }
  
        }
      }
  
      this.grid = next; 
    }
  
    sumNeighbors(grid, x, y) {
      let sum = 0;
  
      for (let i=-1; i<2; i++) {
        for (let j=-1; j<2; j++) {
          let xi = (x + i + cols) % cols;
          let yi = (y + j + rows) % rows;
          sum += grid[xi][yi];
        }
      }
      sum -= grid[x][y];
      return sum;
    }
    
    resetGrid() {
      for (let i=0; i<cols; i++) {
        for (let j=0; j<rows; j++) {
          this.grid[i][j] = 0;
        }
      }
    }
    
    randomGrid() {
      for (let i=0; i<cols; i++) {
        for (let j=0; j<rows; j++) {
          this.grid[i][j] = floor(random(2));
        }
      }
    }
  }