const templates = {
    react: [
        {
            name: "Interactive Click Counter",
            description: "A counter component with increment and decrement features.",
            params: [
                { name: "Button Color", id: "btnColor", type: "color", default: "#0ea5e9" },
                { name: "Initial Count", id: "initCount", type: "number", default: 0 }
            ],
            compile: (p) => `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(${p.initCount});

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Count: {count}</h2>
      <button 
        style={{ 
          backgroundColor: '${p.btnColor}', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '5px'
        }}
        onClick={() => setCount(count + 1)}
      >
        Add One
      </button>
      <button 
        style={{ 
          backgroundColor: '#64748b', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '5px'
        }}
        onClick={() => setCount(count - 1)}
      >
        Minus One
      </button>
    </div>
  );
}`
        },
        {
            name: "User Details Card",
            description: "A clean profile component detailing contact info.",
            params: [
                { name: "User Name", id: "username", type: "text", default: "Alex Code" },
                { name: "Job Title", id: "job", type: "text", default: "Software Engineer" },
                { name: "Border Glow", id: "glow", type: "color", default: "#10b981" }
            ],
            compile: (p) => `import React from 'react';

export default function ProfileCard() {
  return (
    <div style={{
      border: '2px solid ${p.glow}',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '300px',
      backgroundColor: '#1e293b',
      color: '#f8fafc',
      fontFamily: 'sans-serif',
      boxShadow: '0 4px 15px ${p.glow}44'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '${p.glow}' }}>${p.username}</h3>
      <p style={{ margin: '0 0 15px 0', fontStyle: 'italic' }}>${p.job}</p>
      <hr style={{ border: '0', borderTop: '1px solid #475569', margin: '10px 0' }} />
      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Created with Kawerify Learn</span>
    </div>
  );
}`
        }
    ],
    python: [
        {
            name: "Number Guessing Game",
            description: "Interactive CLI game using random choice numbers.",
            params: [
                { name: "Maximum Range", id: "maxNum", type: "number", default: 10 },
                { name: "Max Attempts", id: "attempts", type: "number", default: 3 }
            ],
            compile: (p) => `import random

def play_guessing_game():
    secret_number = random.randint(1, ${p.maxNum})
    attempts = ${p.attempts}
    print("Welcome to Kawerify Guessing Game!")
    print("Guess a number between 1 and ${p.maxNum}.")
    
    for i in range(attempts):
        guess = int(input(f"Attempt {i+1}: Enter guess: "))
        if guess == secret_number:
            print("Hooray! You guessed correctly!")
            return True
        elif guess < secret_number:
            print("Too low!")
        else:
            print("Too high!")
            
    print(f"Game over! The number was {secret_number}.")
    return False

if __name__ == "__main__":
    play_guessing_game()`
        },
        {
            name: "Text Calculator Engine",
            description: "Executes basic operational calculation algorithms.",
            params: [
                { name: "Default Mode", id: "mode", type: "text", default: "Scientific" }
            ],
            compile: (p) => `def calculate(a, b, op):
    print(f"Calculator running in ${p.mode} mode...")
    if op == '+': return a + b
    elif op == '-': return a - b
    elif op == '*': return a * b
    elif op == '/': return a / b if b != 0 else "Error: Division by zero"
    return "Unknown operation"

print(calculate(10, 5, '*'))`
        }
    ],
};