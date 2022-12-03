# About the Project

Assembly language programming and its thorough understanding is a great asset for a Computer Science undergraduate. Experience in programming using lower-level or assembly languages gives an insight into computer architecture and computer organization that is highly valuable. 

### Project Goal

### Task1

You need to write a program with easy to graphical use interface in the programming language of your choice that will simulate the behavior of 8088/8086 processor. The program should include the conversion from assembly language to machine code as per the book (implement at least 15 different instructions with different operands). 
The program should show display the contents of the registers and memory (for simplicity you can use 8 registers and 16 memory locations). 
The program should also give error in case of not allowed instructions like size mismatch etc.

### Task 2

Choose a simple circuit of 8086/88 (preferably circuit but you can also use block diagram) The simulator should also highlight the cycles or modules (like ALU, Memory etc.) used in the current instruction.

## Table of contents
* [Prerequisites](#Prerequisites)
* [8086 Overview](#8086-Overview)
* [File names and Description](#File-names-and-Description)
* [Technologies](#Technologies)
* [Output Screenshots](#Output-Screenshots)
* [Lessons Learnt](#Lessons-Learnt)
* [Setup](#Setup)
* [FAQ](#FAQ)
* [Acknowledgements](#Acknowledgements)
* [Feedback](#Feedback)

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

## File names and Description
The following is a list of filenames along with their description.

### Instructions

#### ROL

ROL instruction stands for Rotate Left.The contents of the operand (register) are rotated left bit-wise by some number of positions depending on the count value. During this rotation, the most significant bit (MSB) is moved into the least significant bit (LSB) position.
Variation(s)  | Example
------------- | -------------
Reg, Imm  | ROL AX, 4

#### ROR

ROR instruction stands for Rotate Right. The contents of the operand are rotated right bit-wise by some number of positions depending on the count value. Since this instruction rotates the bits right, the least significant bit (LSB) is moved into the most significant bit (MSB) position.
Variation(s)  | Example
------------- | -------------
Reg, Imm  | ROR AX, 4

#### SHR

The SHR instruction is an abbreviation for ‘Shift Right’. The SHR instruction is used to shift the bits of the operand destination to the right, by the number of bits specified in the count operand and is filled with zeroes.
Variation(s)  | Example
------------- | -------------
Reg, Imm  | SHR AX, 4

#### SHL

The SHL instruction is an abbreviation for ‘Shift Left’. This instruction simply shifts the mentioned bits in the register to the left side one by one by inserting the same number (bits that are being shifted) of zeroes from the right end. 
Variation(s)  | Example
------------- | -------------
Reg, Imm  | SHL AX, 4

#### INC

The INC instruction is used for incrementing an operand by one. It works on a single operand that can be either in a register or in memory.
Variation(s)  | Example
------------- | -------------
Reg  | Inc AX
Mem  | Inc \[AX]

#### DEC

The DEC instruction is used for decrementing an operand by one. It works on a single operand that can be either in a register or in memory.
Variation(s)  | Example
------------- | -------------
Reg  | Dec AX
Mem  | Dec \[AX]

#### NOT:

NOT operation performs the 1s complement of the operand 
Variation(s)  | Example
------------- | -------------
Reg  | Not AX
Mem  | Not \[AX]

#### AND:

The AND instruction performs a Boolean (bitwise) AND operation between each pair of matching bits in two operands and places the result in the destination operand.
Variation(s)  | Example
------------- | -------------
Reg, Reg  | AND AX, BX
Reg, Imm  | AND AX, FF23h
Reg, Mem  | AND AX, \[BX]
Mem, Imm  | AND \[AX], FF23h
Mem, Reg  | AND \[AX], AX

#### XOR

Performs a bit-wise xor of the two operands, and stores the result in destination.
Variation(s)  | Example
------------- | -------------
See [AND]

#### CBW

It converts byte in Al to word in Ax. It takes first digit hex of Al and converts to binary, takes 1st digit of binary and extends this number to first 2 hex of Ax. Copy rest of the data in Al into last 2 hex of Ax as it is.

## Technologies

Project is created using:
* JavaScript 
* HTML
* CSS

## Output Screenshots


## Lessons Learnt

* 8086 memory and register addressing
* 8086 machine code generation for each instruction
* Assemby language instructions implementation back end logic
* linking UI and code 
* Complex problem solving due to issues that arose during creation of parsing and compiling
* Github coordination in group, inclusing installation, setup


## Setup

## FAQ

#### Question 1

Answer 1

#### Question 2

Answer 2


## Acknowledgements

 - [The Intel Microprocessors 8086 ](https://userpages.umbc.edu/~squire/intel_book.pdf)

## Feedback

If you have any feedback, please reach out to us at hnaeem.bscs21seecs@seecs.edu.pk
