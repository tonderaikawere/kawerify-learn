const curriculum = {
    react: {
        title: "React Library",
        mascot: "Robby the Robot",
        mascotEmoji: "🤖",
        color: "var(--accent-blue)",
        lessons: [
            {
                title: "LEGO Components",
                kid: "React is like playing with LEGO blocks! Instead of building one giant wall, you build small blocks like a door, window, or roof, and then snap them together to make a house. In React, these blocks are called **Components**!",
                dev: "React is a component-based UI library. A component is a self-contained unit of code that renders a piece of the user interface. It combines HTML structure and JavaScript behavior into a reusable function."
            },
            {
                title: "Props (Instructions)",
                kid: "Imagine Robby the Robot needs instructions. If you tell him 'build a red wall' or 'build a blue wall', the color you pass him is a **Prop**! Props are just settings we pass to our LEGO blocks to change how they look.",
                dev: "Props (short for properties) are read-only inputs passed from a parent component to a child component. They allow you to dynamically customize components, maintaining a unidirectional data flow."
            },
            {
                title: "State (Memory)",
                kid: "State is Robby's memory. If Robby counts how many steps he takes, that number changes! In React, when a component's memory (**State**) changes, the screen automatically updates to show the new number.",
                dev: "State is a built-in React object used to store data that changes over time. When the state object changes, React re-renders the component to keep the UI in sync with the underlying data."
            }
        ],
        quizzes: [
            {
                q: "What is a Component in React?",
                a: ["A LEGO-like building block for UI", "A computer battery", "A type of internet connection"],
                correct: 0,
                kidFeedback: "Great job! A component is a Lego building block!",
                devFeedback: "Correct. Components are modular, reusable building blocks of a React UI."
            },
            {
                q: "How are Props different from State?",
                a: ["State is passed from outside, Props are internal memory", "Props are passed from outside, State is internal memory", "They are exactly the same thing"],
                correct: 1,
                kidFeedback: "Awesome! Props are settings passed in, and State is internal memory!",
                devFeedback: "Correct. Props are immutable parameters received from parents; state is managed internally and triggers re-renders."
            }
        ]
    },
    python: {
        title: "Python Language",
        mascot: "Penny the Python",
        mascotEmoji: "🐍",
        color: "var(--accent-green)",
        lessons: [
            {
                title: "Variables (Labeled Boxes)",
                kid: "Python is like a magical bedroom. A **Variable** is a box with a label! You can store a toy inside, like writing `my_box = 'Teddy Bear'`. Whenever you say `my_box`, Python brings out the Teddy Bear!",
                dev: "Variables in Python are dynamically-typed references to objects in memory. They are created when a value is assigned to them using the `=` operator, and do not require explicit type declaration."
            },
            {
                title: "Functions (Recipe Machines)",
                kid: "A **Function** is like a magic cooking machine! You put ingredients in (inputs), the machine does a recipe, and it outputs a cake. In code, we define it like `def bake_cake(flour):`.",
                dev: "Functions are organized, reusable blocks of code that perform a single, related action. They are defined using the `def` keyword, can accept parameters, and return values using the `return` statement."
            },
            {
                title: "Loops (Rollercoasters)",
                kid: "A **Loop** is like riding a rollercoaster over and over! If you want to say 'Hello' 5 times, you tell Python to loop 5 times using `for i in range(5):`. No need to write it 5 times!",
                dev: "Loops allow you to execute a statement or group of statements multiple times. Python uses `for` loops to iterate over sequences (lists, dictionaries, ranges) and `while` loops for conditional iterations."
            }
        ],
        quizzes: [
            {
                q: "How do you store a value in Python?",
                a: ["x = 5", "store(5) in x", "x <- 5"],
                correct: 0,
                kidFeedback: "Perfect! You use the `=` sign to put the value in your box!",
                devFeedback: "Correct. The `=` assignment operator binds a name to an object in Python."
            },
            {
                q: "What does the 'def' keyword do?",
                a: ["Defines a variable", "Defines a function", "Defines a loop"],
                correct: 1,
                kidFeedback: "Amazing! 'def' tells Python you are making a recipe machine!",
                devFeedback: "Correct. `def` is the keyword used to define functions in Python."
            }
        ]
    },
    c: {
        title: "C Language",
        mascot: "Captain C",
        mascotEmoji: "⚓",
        color: "var(--accent-yellow)",
        lessons: [
            {
                title: "Types & Strict Sizes",
                kid: "In C, you have to be very organized. Every box must be built for a specific toy! A number box (`int`) can only hold numbers, and a letter box (`char`) can only hold letters. You can't mix them up!",
                dev: "C is a statically typed language. Every variable must be declared with a data type (e.g. `int`, `float`, `char`, `double`), which dictates the size of memory allocated and how the binary data is interpreted."
            },
            {
                title: "Pointers (Treasure Maps)",
                kid: "A **Pointer** is a treasure map! It doesn't have gold inside; instead, it has the exact coordinates of where the gold is buried in memory. If you follow the coordinates, you find the value!",
                dev: "A pointer is a variable that stores the memory address of another variable. The `&` operator retrieves a variable's address, and the `*` operator dereferences a pointer to access or modify the value at that address."
            },
            {
                title: "Memory Allocation (Renting Boxes)",
                kid: "C doesn't clean up your room automatically! When you need space, you ask for it using `malloc()` (renting space). When you're done, you MUST call `free()` to give it back, or your room gets full!",
                dev: "C provides manual memory management. Dynamic memory is allocated on the heap using `malloc()` or `calloc()` and must be explicitly deallocated using `free()` to prevent memory leaks."
            }
        ],
        quizzes: [
            {
                q: "What does a Pointer store?",
                a: ["A number value", "A memory address", "A text string"],
                correct: 1,
                kidFeedback: "Super! A pointer is a map that stores a memory coordinates address!",
                devFeedback: "Correct. Pointers store hexadecimal memory addresses of variable locations."
            },
            {
                q: "What must you do after using malloc()?",
                a: ["Call free() to release memory", "Nothing, C cleans it up", "Call delete()"],
                correct: 0,
                kidFeedback: "Brilliant! You must call free() so you don't run out of storage space!",
                devFeedback: "Correct. Every malloc call requires a corresponding free call to avoid memory leaks."
            }
        ]
    },
