# Toy Drone Assessment
## Rules of Engagement
### Interface
The interface needs to look as good as possible and also work on both mobile and desktop devices. The
logic part of the test should only take about a day to complete, so use the rest of the time to embellish
the interface it as much as possible, really show us what you can do, show us your creative side!
### Logic
The assessment / game is a simulation of a toy drone moving on a square surface (you decide what the
surface looks like), The dimensions of the surface are 10 units x 10 units. There are no other
obstructions on the surface. The drone is free to roam around the surface, but must be prevented from
falling crossing the boundary. Any movement that would result in the drone crossing the surface
boundary must be prevented, however further valid movement commands must still be allowed.
The game needs to accept the following commands:
1) PLACE X,Y,F MOVE LEFT RIGHT REPORT ATTACK
PLACE will put the toy drone on the surface in position X,Y and facing NORTH, SOUTH, EAST or WEST.
The origin (0,0) can be considered to be the SOUTH WEST most corner. The first valid command to the
drone is a PLACE command. After the place command, any sequence of commands may be issued, in
any order, including another PLACE command. The application should discard all commands in the
sequence until a valid PLACE command has been executed.
2) MOVE will move the toy drone one unit forward in the direction it is currently facing. LEFT and RIGHT
will rotate the drone 90 degrees in the specified direction without changing the position of the drone.
REPORT will announce the X,Y and F of the drone. This can be in any form. ATTACK will cause the
drone to fire a projectile 2 units ahead of the current position and explode on the surface. If there are
not 2 free spaces on the surface in the direction that the drone is facing the command should be
ignored. If the Drone is not yet on the surface the only command that should be accepted is the place
command Input is the developer’s choice but needs to be as intuitive as possible.
Example Input and Output:
Internal
a) PLACE 0,0,NORTH
MOVE
LEFT
LEFT
ATTACK
REPORT - Output: 0,0,SOUTH
b) PLACE 0,0,NORTH
LEFT
REPORT Output: 0,0,WEST
c) PLACE 1,2,EAST
MOVE
MOVE
LEFT
MOVE
ATTACK
REPORT Output: 3,3,NORTH
