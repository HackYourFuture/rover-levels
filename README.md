# Levels for Rover

Hi everyone! This repository contains levels for the game Rover (http://roverjs.com).

## How to use

There are two branches in this repository: `live` and `test`. As you guess, the `live` branch contains the levels used
by http://roverjs.com. But, there is also a testing environment at http://test.roverjs.com, which loads levels from
the `test` branch.

When designing new chapters, please create them in the `test` branch first, and test them out. When you're satisfied,
merge `test` into `live`.

## Chapters

Rover levels are grouped by chapter. A chapter is a logical collection of levels that share a single theme or topic,
e.g. "Variables" or "Loops Advanced".

Each chapter is a separate directory in this repository. Within each of these directories, there should be a file called
`chapter.yml`, containing the name and description of the chapter, e.g.

**`variables/chapter.yml`**:
```yaml
name: Variables
description: |-
  Learn about declaring and using variables
```

The other `.yml` files in the chapter directory are the level files (see below). They are loaded in alphabetical order, so best to use
an ordering scheme like `variables1.yml`, `variables2.yml`, etc.

> Note: If you add a chapter, make sure to list it in the file **`chapters.yml`** in the root of this repository.

## Levels

Each level is configured using a `.yml` file, which looks like this:

```yaml
name: Variables 1         # The name of the chapter, actually not displayed, but fill it in anyway
instructions: |-          #
  Use variables to move   #
  Rover around!           # Instructions for the player, in Markdown.
                          #
rows: 5                   # Number of rows in the level (i.e. grid height).
columns: 5                # Number of columns in the level (i.e. grid width).
start: [0, 0, "down"]     # Start position and direction ("up", "down", "left", "right")
goal:  [4, 4]             # Goal position. This is actually optional, so you could in theory
                          # create some playground level without a goal.
goalApples: 6             # In case your level has apples, specify how many the player should
                          # have in order to finish the level.
dark: false               # Set to true to make the level dark (i.e. invisible items).
                          #
items:                    # The items in the level:
  - [1, 0, "tree"]        # This adds a tree at {x: 1, y: 0}.
  - [1, 1, "water"]       # This adds water at {x: 1, y: 1}.
  - [0, 1, "apple"]       # This adds an apple at {x: 0, y: 1}.
  - [2, 1, "key", {...}]  # This adds a key at {x: 2, y: 1}. See below for keys & locks.
  - [3, 3, "lock", {...}] # This adds a lock at {x: 3, y: 3}. See below for keys & locks.
                          #
initialCode: |-           # Here you can place initial code for the player. This property
  // Write your code here # is optional.
                          #
scoring:                  # Also optional, this is used to give the player less than three
                          # stars if they haven't followed some convention or something.
  tests:                  # Write possible tests here:
    usedForLoop:          # This is the name of the test.
      regexp: for\s+\(    # This test uses a regexp.
    short:                #
      maxLines: 5         # This tests whether the program is at most 5 lines long.
    long:                 #
      minLines: 5         # This tests whether the program is at least 5 lines long.
    fiveLines:            #
      maxLines: 5         # Tests can have multiple conditions:
      minLines: 5         # This tests whether the program is exactly 5 lines long.
                          #
  scores:                 # Here you assign scores. The first matching score is used.
    - score: 1            # For one star:
      usedForLoop: false  # If no for loop was used
      message: |-         #
        Try a for loop!   # Display this message.
    - score: 2            # For two stars:
      long: true          # If the program is not too short.
      message: |-         #
        Can you do it in  # Display this message.
        five lines?       #
```

### Read-only code

In your initial code, it is possible to mark sections as read only. Use the special markers `----` and `++++` to
mark a section as read only:

```js
// Write your code here.

// ---- This code cannot be modified by the player.
move();
move();
// ++++ After this line, the code is editable again.
```

### Keys

When defining key or lock items, you should specify additional properties, e.g.

```yaml
items:
  - [1, 1, "key", {color: "red", keyType: "number"}]
```

This creates a **red** key of type `number`. When the program is run, any value between `1` and `10`
is assigned to this key.

Available types are the primitive JS types `boolean`, `number`, and `string` as well as `any`, which
may get a value of any of these types.

To create a key with one specific static value, use:

```yaml
items:
  - [1, 1, "key", {color: "red", keyType: "number", value: 5}]
```

Available key colors are `'yellow'`, `'red'`, `'green'`, `'blue'` and `'rainbow'`. In our levels,
we typically use yellow keys for `boolean`, red keys for `number`, green keys for `string`, and rainbow
keys for `any`. Blue keys are used in boolean levels where we want to combine multiple keys.

But, there's no technical requirement for these color mappings!

### Locks

Like keys, locks also accept more properties.

```yaml
items:
  - [3, 3, "lock", {color: "green", accept: "({green}) => -green"}]
```

The `color` property accepts the same values as the `key` color properties. The `accept` property
is a string containing a JS *arrow* function that maps an object with the key colors ars keys keys
to the required value to unlock the lock with.

For locks that operate on multiple keys, use the `acceptsKeys` property to specify which keys
serve as input, so that their unlock scheme displays all possible combinations:

```yaml
items:
  - [3, 3, "lock", {color: "rainbow", acceptsKeys: ["red", "blue"], accept: "({red, blue}) => red && blue"}]
```

By default, `acceptsKeys` is an array containing only the color of the lock.
