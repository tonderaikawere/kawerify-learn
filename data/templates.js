const templates = {
    cpp: [
        {
            name: "STL Dynamic Vector",
            description: "Demonstrates inserting and printing dynamic vectors.",
            params: [
                { name: "First Item", id: "item1", type: "number", default: 10 },
                { name: "Second Item", id: "item2", type: "number", default: 20 }
            ],
            compile: (p) => `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers;
    std::cout << "Packing magic backpack...\\n";
    numbers.push_back(\${p.item1});
    numbers.push_back(\${p.item2});
    numbers.push_back(30);
    
    std::cout << "Backpack capacity: " << numbers.size() << "\\n";
    std::cout << "Items list: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << "\\n";
    return 0;
}`
        },
        {
            name: "OOP Class Inheritance",
            description: "Encapsulates robot base blueprints inheriting derived class stats.",
            params: [
                { name: "Robot Name", id: "botname", type: "text", default: "Iron Giant" }
            ],
            compile: (p) => `#include <iostream>
#include <string>

class Robot {
protected:
    std::string name;
public:
    Robot(std::string n) : name(n) {}
    virtual void speak() {
        std::cout << "Beep Boop! I am " << name << "\\n";
    }
};

class SuperRobot : public Robot {
public:
    SuperRobot(std::string n) : Robot(n) {}
    void speak() override {
        std::cout << "ZOOM! I am " << name << ", the ultimate defender!\\n";
    }
};

int main() {
    SuperRobot bot("\${p.botname}");
    bot.speak();
    return 0;
}`
        }
    ],
    csharp: [
        {
            name: "LINQ Query Filter",
            description: "Filters collection integer values utilizing LINQ.",
            params: [
                { name: "Threshold Value", id: "threshold", type: "number", default: 15 }
            ],
            compile: (p) => `using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        List<int> numbers = new List<int> { 5, 10, 15, 20, 25, 30 };
        Console.WriteLine("LINQ magic wand searching...\\n");
        
        var query = from num in numbers
                    where num > \${p.threshold}
                    select num;
                    
        Console.WriteLine("Filtered results greater than \${p.threshold}:");
        foreach (var val in query) {
            Console.WriteLine(val);
        }
    }
}`
        },
        {
            name: "Namespaced Variables Class",
            description: "Demonstrates C# class scope address resolving.",
            params: [
                { name: "Room Number", id: "room", type: "text", default: "RoomA" }
            ],
            compile: (p) => `using System;

namespace School.\${p.room} {
    class Student {
        public string Name { get; set; } = "Alex";
    }
}

class Program {
    static void Main() {
        var student = new School.\${p.room}.Student();
        Console.WriteLine("Address resolved namespace Class...");
        Console.WriteLine("Found student " + student.Name + " in \${p.room}");
    }
}`
        }
    ],
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
    c: [
        {
            name: "Swapper (Pointer Lesson)",
            description: "Swaps two variable values using memory references.",
            params: [
                { name: "First Value", id: "val1", type: "number", default: 42 },
                { name: "Second Value", id: "val2", type: "number", default: 99 }
            ],
            compile: (p) => `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = ${p.val1};
    int y = ${p.val2};
    printf("Before swap: x = %d, y = %d\n", x, y);
    swap(&x, &y);
    printf("After swap:  x = %d, y = %d\n", x, y);
    return 0;
}`
        },
        {
            name: "Custom Array Sorter",
            description: "Statically sorts arrays of values using bubble sort.",
            params: [
                { name: "Array Size", id: "size", type: "number", default: 5 }
            ],
            compile: (p) => `#include <stdio.h>

void bubble_sort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

int main() {
    int data[${p.size}] = {23, 12, 89, 5, 54};
    int n = ${p.size};
    printf("Sorting array...\n");
    bubble_sort(data, n);
    for(int i=0; i<n; i++) {
        printf("%d ", data[i]);
    }
    printf("\n");
    return 0;
}`
        }
    ],
    php: [
        {
            name: "Contact Form Handler",
            description: "Extracts post variables and handles email redirection.",
            params: [
                { name: "Receiver Email", id: "receiver", type: "text", default: "hello@kawerifytech.com" }
            ],
            compile: (p) => `<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    $email = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);
    $msg = htmlspecialchars($_POST["message"]);
    
    if ($email) {
        $to = "${p.receiver}";
        $subject = "New Contact from " . $name;
        $headers = "From: " . $email;
        
        // mail($to, $subject, $msg, $headers);
        echo "Thank you, your message has been sent to " . $to;
    } else {
        echo "Error: Invalid email address.";
    }
}
?>`
        },
        {
            name: "Secure Password Hasher",
            description: "Demonstrates dynamic password hashing verification.",
            params: [
                { name: "Hash Strength", id: "cost", type: "number", default: 10 }
            ],
            compile: (p) => `<?php
$password = "Kawerify123!";
$options = [
    'cost' => ${p.cost}
];

$hashedPassword = password_hash($password, PASSWORD_BCRYPT, $options);
echo "Raw Password: " . $password . "\n";
echo "Hashed Result: " . $hashedPassword . "\n";

if (password_verify("Kawerify123!", $hashedPassword)) {
    echo "Password verified successfully!";
} else {
    echo "Verification failed.";
}
?>`
        }
    ],
    javascript: [
        {
            name: "Interactive Alert Button",
            description: "Adds a click listener showing styled notifications.",
            params: [
                { name: "Alert Text", id: "alertTxt", type: "text", default: "Sparky is excited!" }
            ],
            compile: (p) => `// JavaScript code
const btn = document.querySelector("#my-btn");
btn.addEventListener("click", () => {
    alert("${p.alertTxt}");
});`
        }
    ],
    html_css: [
        {
            name: "Hero Landing Banner",
            description: "Clean responsive layout banner using CSS flexbox.",
            params: [
                { name: "Banner Text", id: "bannerText", type: "text", default: "Learn Code Free!" },
                { name: "Theme Color", id: "themeCol", type: "color", default: "#10b981" }
            ],
            compile: (p) => `<!-- HTML -->
<div class="banner">
    <h1>${p.bannerText}</h1>
    <button id="my-btn">Get Started</button>
</div>

<!-- CSS -->
<style>
.banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #0f172a;
    color: white;
    font-family: 'Outfit', sans-serif;
    border: 3px solid ${p.themeCol};
    border-radius: 10px;
}
h1 {
    color: ${p.themeCol};
    font-size: 2.5rem;
    margin-bottom: 20px;
}
button {
    background-color: ${p.themeCol};
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 10px ${p.themeCol}88;
}
</style>`
        }
    ]
};

if (typeof window !== 'undefined') { window.templates = templates; }

// Added template content definitions placeholder comment
// C++ inheritance template added to compiler templates mapping.
// C# filtering class template added to generator models.
// C# query selectors template added to compile options.
// C# namespace scope templates added to variables compiler.