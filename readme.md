# About the Project

Assembly language programming and its thorough understanding is a great asset for a Computer Science undergraduate. Experience in programming using lower-level or assembly languages gives an insight into computer architecture and computer organization that is highly valuable.

# [Project Live Here](https://umerkay.github.io/processorsim/)

### Project Goal

### Task 1

You need to write a program with easy to graphical use interface in the programming language of your choice that will simulate the behavior of 8088/8086 processor. The program should include the conversion from assembly language to machine code as per the book (implement at least 15 different instructions with different operands).
The program should show display the contents of the registers and memory (for simplicity you can use 8 registers and 16 memory locations).
The program should also give error in case of not allowed instructions like size mismatch etc.

### Task 2

Choose a simple circuit of 8086/88 (preferably circuit but you can also use block diagram) The simulator should also highlight the cycles or modules (like ALU, Memory etc.) used in the current instruction.

## Table of contents

- [Prerequisites](#Prerequisites)
- [8086 Overview](#8086-Overview)
- [Setup and Usage](#Setup-and-Usage)
- [Implementation](Implementation)
- [File names and Description](#File-names-and-Description)
- [Technologies](#Technologies)
- [Output Screenshots](#Output-Screenshots)
- [Lessons Learnt](#Lessons-Learnt)
- [FAQ](#FAQ)
- [Acknowledgements](#Acknowledgements)
- [Feedback](#Feedback)

## Prerequisites

These programs are intended for those who are familiar with assembler, or have a bit of idea about it. Of course if you have knowledge of some other programming language (Basic, C/C++ ...) that may help you a lot.

## 8086 Overview

8086 is a 16-bit microprocessor. It has 20 bit address bus that can access upto 220 memory locations
(1 MB). It can support upto 64K input/output ports. It provides 14, 16-bit internal registers. It has
multiplexed address and data bus AD0 − AD15 and A16 − A19. It requires single phase clock with
33% duty cycle to provide internal cycle. 8086 is designed to operate in two modes- Minimum and
Maximum mode. Its improvements over 8085 microprocessor includes pipelining, instruction queue,
and segmentation. It can pre-fetch upto 6 instruction byte from memory and queue them in order
to speed up instruction execution (Pipelining). It usually requires +5V power supply. It is packaged
under a 40 pin dual inlined package.

## Setup and Usage

This is a web project, so no setup or download is required. Simply visit the link at the top of this document. However, if you wish to run this application locally, simply clone the repository and open index.html in any browser.

The application is very intuitive to use. The main screen offers four sections.
The memory and register sections which display the contents of memory and registers respectively. Assembly code is entered into the textarea input and any and all outputs are shown in the output box.
![image](https://user-images.githubusercontent.com/20483712/205465014-3f889730-d48d-43bb-9966-7c67c856d511.png)
You can press "Shift" + "T" to toggle processor mode, which shows all animations and a simple block diagram for 8086.
![image](https://user-images.githubusercontent.com/20483712/205465105-2dc86fe8-ee1a-43b0-90b3-6dadadc7205c.png)

![image](https://user-images.githubusercontent.com/20483712/205465219-faa8b14b-15d2-4efc-b56e-da15d00735b6.png)
Button | Purpose
------------- | -------------
Assemble | Assembles the code into machine code and displays the contents in the output box.
Execute All | Resets PC and sequentially executes all instructions.
Execute Next | Executes a single instruction and increments PC.
Reset | Resets all registers and memory locations to default values.

## Implementation

### Registers

In our simulator, we have implemented the following eight registers:

- AX
- BX
- CX
- DX
- DS
- DI
- [to be added]
- [to be added]

All the above registers are 16-bits; however, the lower 8-bits of the first four registers, i.e., AL, BL, CL, DL are addressable and accessible. The upper 8-bits of the same registers are not addressable.

### Memory

The simulator displays 16 memory locations, each of one byte. By default, these memory locations start at address 00000h till 0000Fh.

### Immediate Values

In our simulator, the following possibilities of immediate values can be given in instructions:
Base | Representation | Example
-----|--------------|----------
Binary | A binary number is followed by a "b" | 1001b
Hexadecimal | A Hex number is followed by an "h" | FA37h
Decimal | A number with no base specified | 385

### Adressing

In our simulator, a memory location can be accessed either by storing its address in a register and accessing it (as [REG]); or, as is only allowed in two operands instructions, by putting the memory address in square brackets directly (as [1234h]).
Segmentation has not been implemented in this simulator, therefore when accessing memory address using registers, the address is internally appended with a “0” to the left.  
Thus, if AX is 1234h, then [ax] accesses the memory location 01234h. Moreover, in our implementation, displacement values are not allowed when addressing memory.  
Whenever performing two operands instructions on a register and a memory location, two consecutive memory locations (16-bits) are addressed if the register is 16-bits register (such as AX); otherwise only one memory location is addressed.
#### Allowed
```
MOV [AX], BX
MOV BX, [1234h]
NEG [AX]
```
#### Not Allowed
```
MOV [AX + 5h], BX
MOV [1000h + 5h], BX
NEG [1234h]
```

## File names and Description

The following is a list of filenames along with their description.
File Name | Purpose
------------- | -------------
instructionSet8086.js | This file contains all of the configuration details of our specific implementation of 8086 Assembly. It describes registers, instructions, memory addresses and contains the code for conversion of individual instructions into binary format.
renderer.js | This file uses the register and memory information to construct HTML elements on the screen. Registers and memory locations are dynamically rendered through JavaScript code.
interface.js | This file contains many helper functions that sugarcoat the HTML syntax into useful functions. It acts as an interface between our HTML independant assembler code logic, and the very HTML dependant rendering and UI logic. Animations are defined here.
assembler.js | This file is where all of the assembly code is converted into machine code. It parses the operands, generates assembler errors and eventually forms the binary machine code. This code is then used to execute the actual instructions. Also handles displaying animations.

### Instructions

#### MOV

The MOV instruction is a two operands instruction. It takes data from a source and copies it into a destination. The general format of a MOV instruction is: MOV destination, source.
In our simulator, we have implemented the following variations of the mov instruction:
Variation(s) | Example
------------- | -------------
REG, REG | MOV AX, BX
REG, [REG] | MOV AX, [BX]
[REG], REG | MOV [AX], BX
REG, IMM | MOV AX, 1234h
[REG], IMM | MOV [AX], 1234h
REG, MEM | MOV AX, [1234h]
MEM, REG | MOV [1234h], BX

#### ADD

The ADD instruction is a two operands instruction. The general format for this instruction is: ADD destination, source. As its intuitive name suggests, this instruction adds the data in the source register to the data in the destination register and saves it in the destination register.
We have implemented the same variations as [MOV](#MOV).

#### SUB

The SUB instruction is a two operands instruction. Its general format is: SUB destination, source. This instruction, again thanks to our intuitive naming system, subtracts the data in the source register from the destination register and stores it in the destination register. In case the result of the operation is a negative number, it is stored in 2’s complement form.
We have implemented the same variations as [MOV](#MOV).

#### OR

The OR operation is a two operands instruction. The general structure of OR instruction is: OR destination, source. This instruction performs the bitwise OR operation on the corresponding bits of the destination and source registers and stores the result in that specific bit of the destination register.
The variations implemented are the same as [MOV](#MOV).

#### MUL

The MUL instruction stands for multiply. It takes only one operand, a register. The general formal for MUL instruction is: MUL, REG. The MUL instruction multiplies the data in “al” register with the data of the register given in the instruction.
This instruction only takes 8-bit registers as operands, such as “bl”, “cl”, etc.

#### NOP

NOP stands for “No operation”. This instruction does nothing.

#### NEG

The NEG instruction stands for “negate”, and it is a single operand instruction. The general format of this instruction is NEG destination. This instruction multiplies the value in the destination with -1 (that is, it negates the value) and stores it back in the destination.
The negative values are stored in 2’s complement form; whereas negative values, if negated again, are stored back in normal form. The following variations have been implemented here:
Variation(s) | Example
------------|---------
NEG REG | NEG AX
NEG [REG] | NEG [BX]

#### ROL

ROL instruction stands for Rotate Left.The contents of the operand (register) are rotated left bit-wise by some number of positions depending on the count value. During this rotation, the most significant bit (MSB) is moved into the least significant bit (LSB) position.
Variation(s) | Example
------------- | -------------
Reg, Imm | ROL AX, 4

#### ROR

ROR instruction stands for Rotate Right. The contents of the operand are rotated right bit-wise by some number of positions depending on the count value. Since this instruction rotates the bits right, the least significant bit (LSB) is moved into the most significant bit (MSB) position.
Variation(s) | Example
------------- | -------------
Reg, Imm | ROR AX, 4

#### SHR

The SHR instruction is an abbreviation for ‘Shift Right’. The SHR instruction is used to shift the bits of the operand destination to the right, by the number of bits specified in the count operand and is filled with zeroes.
Variation(s) | Example
------------- | -------------
Reg, Imm | SHR AX, 4

#### SHL

The SHL instruction is an abbreviation for ‘Shift Left’. This instruction simply shifts the mentioned bits in the register to the left side one by one by inserting the same number (bits that are being shifted) of zeroes from the right end.
Variation(s) | Example
------------- | -------------
Reg, Imm | SHL AX, 4

#### INC

The INC instruction is used for incrementing an operand by one. It works on a single operand that can be either in a register or in memory.
Variation(s) | Example
------------- | -------------
Reg | Inc AX
Mem | Inc \[AX]

#### DEC

The DEC instruction is used for decrementing an operand by one. It works on a single operand that can be either in a register or in memory.
Variation(s) | Example
------------- | -------------
Reg | Dec AX
Mem | Dec \[AX]

#### NOT:

NOT operation performs the 1s complement of the operand
Variation(s) | Example
------------- | -------------
Reg | Not AX
Mem | Not \[AX]

#### AND:

The AND instruction performs a Boolean (bitwise) AND operation between each pair of matching bits in two operands and places the result in the destination operand.
Variation(s) | Example
------------- | -------------
Reg, Reg | AND AX, BX
Reg, Imm | AND AX, FF23h
Reg, Mem | AND AX, \[BX]
Mem, Imm | AND \[AX], FF23h
Mem, Reg | AND \[AX], AX

#### XOR

Performs a bit-wise xor of the two operands, and stores the result in destination.
Variation(s) | Example
------------- | -------------
See [AND](#AND)

#### CBW

The CBW (convert byte to word) instruction copies the sign (bit 7) in the source operand into every bit in the AH register.
Example Usage:

```
MOV AL, -9h
CBW
```

## Technologies

Project is created using:

- JavaScript
- HTML
- SCSS

## Output Screenshots

### Task 1

#### Example 1

```
mov [ax], 5432h
mov bx, 3040h
add [ax], bx
```

Before assembling and executing
![image](https://user-images.githubusercontent.com/20483712/205464862-c817a5e9-a450-4f99-9434-e3fbf6601b59.png)
After assembling and executing: Assembled binary is shown in the output box, while the relevant register values and memory locations have been updated.
![image](https://user-images.githubusercontent.com/20483712/205464886-98e8b415-e81f-457e-9b1c-14fd28115b09.png)

## Lessons Learnt

- 8086 memory and register addressing
- 8086 machine code generation for each instruction
- Assemby language instructions implementation back end logic
- linking UI and code
- Complex problem solving due to issues that arose during creation of parsing and compiling
- Github coordination in group, inclusing installation, setup

## FAQ

#### Question 1

Answer 1

#### Question 2

Answer 2

## Acknowledgements

- [The Intel Microprocessors 8086 ](https://userpages.umbc.edu/~squire/intel_book.pdf)

## Feedback

If you have any feedback, please reach out to us at hnaeem.bscs21seecs@seecs.edu.pk
