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
