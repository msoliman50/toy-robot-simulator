enum DIRECTION {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST'
}
const DIRECTIONS = [...Object.values(DIRECTION)];
const ALLOWED_COMMANDS = ['PLACE', 'MOVE', 'RIGHT', 'LEFT', 'REPORT'];
const MAX_POSITION = 4;
const MIN_POSITION = 0;

class Robot {
  private x: number;
  private y: number;
  private direction: DIRECTION;

  constructor() {
    this.x = -1;
    this.y = -1;
    this.direction = DIRECTION.NORTH;
  }

  private isValidPosition(position: number): boolean {
    if (
      !(
        typeof position === 'number' &&
        position >= MIN_POSITION &&
        position <= MAX_POSITION
      )
    )
      return false;
    return true;
  }

  private place(x: number, y: number, f: DIRECTION): void {
    // validate the x,y position
    if (!(this.isValidPosition(x) && this.isValidPosition(y))) {
      console.log(
        `ERROR: position has to be a valid number between ${MIN_POSITION} - ${MAX_POSITION}`
      );
      return;
    }

    // validate the direction
    if (!DIRECTIONS.includes(f)) {
      console.log(
        `ERROR: F must be one of the following: [${Object.values(DIRECTION)}]`
      );
      return;
    }

    this.x = x;
    this.y = y;
    this.direction = f;
  }

  private move(): void {
    try {
      switch (this.direction) {
        case DIRECTION.NORTH:
          if (!this.isValidPosition(this.y + 1)) {
            throw new Error('invalid y position');
          }
          this.y++;
          break;

        case DIRECTION.SOUTH:
          if (!this.isValidPosition(this.y - 1)) {
            throw new Error('invalid y position');
          }
          this.y--;
          break;
        case DIRECTION.EAST:
          if (!this.isValidPosition(this.x + 1)) {
            throw new Error('invalid x position');
          }
          this.x++;
          break;
        case DIRECTION.WEST:
          if (!this.isValidPosition(this.x - 1)) {
            throw new Error('invalid x position');
          }
          this.x--;
          break;
      }
    } catch (error) {
      console.log(
        'ERROR: can not move the robot outside the allowed boundries'
      );
    }
  }

  private changeDirection(direction: string): void {
    let nextDirectionIndex: number;
    const currentDirectionIndex = DIRECTIONS.indexOf(this.direction);

    if (direction === 'LEFT') {
      nextDirectionIndex =
        currentDirectionIndex - 1 < 0
          ? DIRECTIONS.length - 1
          : currentDirectionIndex - 1;
    } else {
      nextDirectionIndex =
        currentDirectionIndex + 1 >= DIRECTIONS.length
          ? 0
          : currentDirectionIndex + 1;
    }

    this.direction = DIRECTIONS[nextDirectionIndex];
  }
  private report(): void {
    console.log(`REPORT: ${this.x}, ${this.y}, ${this.direction}`);
  }

  execCommand(command: string): void {
    const commandParts = command.split(' ');
    if (commandParts.length < 1) {
      console.log(`ERROR: ${command} invalid command`);
      return;
    }

    const mainCommand = commandParts[0].toUpperCase();

    // check if the command is valid
    if (!ALLOWED_COMMANDS.includes(mainCommand)) {
      console.log(`"${command}" is IGNORED: not supported command`);
      return;
    }

    // check the first command to be place
    if (mainCommand != 'PLACE' && this.x === -1 && this.y === -1) {
      console.log(
        `"${command}" is IGNORED: the first command has to be a valid PLACE command`
      );
      return;
    }

    switch (mainCommand) {
      case 'REPORT':
        this.report();
        break;
      case 'MOVE':
        this.move();
        break;
      case 'LEFT':
        this.changeDirection('LEFT');
        break;
      case 'RIGHT':
        this.changeDirection('RIGHT');
        break;
      case 'PLACE':
        if (commandParts.length < 2) {
          console.log(
            `ERROR: ${command} is an invalid PLACE command, missing positions`
          );
          return;
        }
        const positionParts = commandParts[1].split(',');
        if (positionParts.length != 3) {
          console.log(
            `ERROR: ${command} is an invalid PLACE command, invalid positions`
          );
          return;
        }

        try {
          const x = parseInt(positionParts[0]);
          const y = parseInt(positionParts[1]);
          const direction = positionParts[2] as DIRECTION;
          this.place(x, y, direction);
        } catch (error: any) {
          console.log(`ERROR: "${command}" is an invalid PLACE command`);
        }

        break;
      default:
        console.log(`"${command}" is IGNORED: not supported command`);
    }
  }
}

export default Robot;
