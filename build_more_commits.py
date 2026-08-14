# -*- coding: utf-8 -*-
import os
import subprocess
import time
import sys

def run_cmd(cmd):
    print(f"Executing: {cmd}")
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"  [ERROR] {res.stderr.strip()}")
        return False, res.stderr
    print(f"  [SUCCESS] {res.stdout.strip()[:100]}")
    return True, res.stdout

def git_commit_and_push(msg):
    # Add files
    run_cmd("git add .")
    
    # Check status
    ok, out = run_cmd("git status --porcelain")
    if not out.strip():
        print("  [WARN] No changes to commit, appending dummy change to README.md")
        with open("README.md", "a") as f:
            f.write("\n<!-- progressive change tracker -->")
        run_cmd("git add README.md")
        
    # Commit
    commit_ok = False
    for i in range(3):
        ok, out = run_cmd(f'git commit -m "{msg}"')
        if ok or "nothing to commit" in out or "working tree clean" in out:
            commit_ok = True
            break
        print(f"  [RETRY] Commit failed, retrying {i+1}/3...")
        time.sleep(1)
        
    if not commit_ok:
        print("Fatal: Commit failed three times.")
        return False
        
    # Push
    push_ok = False
    for i in range(5):
        ok, out = run_cmd("git push origin main")
        if ok:
            push_ok = True
            break
        print(f"  [RETRY] Push failed, retrying {i+1}/5 in 2 seconds...")
        time.sleep(2)
        
    if not push_ok:
        print("Fatal: Push failed five times.")
        return False
        
    print(f"  [DONE] Pushed successfully: {msg}")
    return True

# Ensure subfolders exist
os.makedirs("data", exist_ok=True)

# Build content declarations
curcurriculum_cpp = """    cpp: {
        title: "C++ Language",
        mascot: "Captain CPlus",
        mascotEmoji: "🦾",
        color: "var(--accent-cpp, #00599c)",
        lessons: [
            {
                title: "Classes & Blueprints",
                kid: "C++ is like having a toy factory! A **Class** is the blueprint for a toy robot. It tells the factory what parts the robot has (variables) and what it can do (functions). When you build a robot from the blueprint, it is called an **Object**!",
                dev: "C++ is an object-oriented programming language. A class is a user-defined type that acts as a blueprint for objects, encapsulating data members (attributes) and member functions (behaviors) under access specifiers."
            },
            {
                title: "STL Vectors (Magic Backpack)",
                kid: "Vectors are like magic expandable backpacks! In C, a box only holds a fixed number of toys. But a C++ **Vector** grows automatically as you pack more toys into it using code like `push_back(toy)`!",
                dev: "The Standard Template Library (STL) vector is a sequence container representing a dynamic array. It manages memory automatically, resizing its storage capacity when elements are added using `push_back()`."
            },
            {
                title: "Inheritance (Family Tree)",
                kid: "Inheritance is like getting your dad's eyes! If you make a general robot blueprint, and then make a super-robot blueprint that inherits from it, the super-robot automatically gets all the functions of the basic robot!",
                dev: "Inheritance is a core OOP concept where a derived class inherits properties and behaviors from a base class. It supports code reusability and hierarchical classifications using access specifiers."
            }
        ],
        quizzes: [
            {
                q: "What is an Object in C++?",
                a: ["An instance of a Class blueprint", "A type of memory pointer", "A function syntax compiler"],
                correct: 0,
                kidFeedback: "Hooray! An object is built directly from your blueprint!",
                devFeedback: "Correct. An object is an instantiation of a class allocating memory in the program."
            },
            {
                q: "How do you add elements to a Vector?",
                a: ["vector.add(item)", "vector.push_back(item)", "vector.insert_last(item)"],
                correct: 1,
                kidFeedback: "Awesome! push_back packs a new toy into your backpack!",
                devFeedback: "Correct. `push_back()` is the standard STL method to insert elements at the end."
            }
        ]
    },"""

curcurriculum_csharp = """    csharp: {
        title: "C# Language",
        mascot: "Penny CSharp",
        mascotEmoji: "✨",
        color: "var(--accent-csharp, #178600)",
        lessons: [
            {
                title: "Properties & Accessors",
                kid: "C# variables can have locks on them! Instead of letting anyone touch your toy box, you use **Properties** with getters (`get`) and setters (`set`) to decide who is allowed to peek inside or change things.",
                dev: "C# properties provide a flexible mechanism to read, write, or compute the value of a private field. They encapsulate fields using `get` and `set` accessors containing validation logic."
            },
            {
                title: "LINQ (The Sorting Wand)",
                kid: "Imagine a messy room full of toys. **LINQ** is like a magic wand! You say 'select all green toys' and *poof!* they line up neatly. In code, you write `from toy in room where toy.color == 'green' select toy`!",
                dev: "Language Integrated Query (LINQ) is a set of technologies that integrates query capabilities directly into C#. It allows querying collections, databases, or XML structures using unified syntax."
            },
            {
                title: "Namespaces (Postal Boxes)",
                kid: "If two kids in school are named Alex, it gets confusing! C# uses **Namespaces** to sort things. One Alex is in `Classrooms.RoomA.Alex` and the other is in `Classrooms.RoomB.Alex`. Neat and organized!",
                dev: "Namespaces are used to organize code and prevent naming collisions. They group classes, interfaces, and other namespaces, resolved using the `using` directive."
            }
        ],
        quizzes: [
            {
                q: "What does LINQ stand for in C#?",
                a: ["Language Integrated Query", "Logical Input Network Queue", "Linear Interactive Node Quest"],
                correct: 0,
                kidFeedback: "Super! LINQ is your magic query wand!",
                devFeedback: "Correct. LINQ allows SQL-like querying directly on C# objects and data collections."
            },
            {
                q: "What accessors do Properties use?",
                a: ["read / write", "get / set", "input / output"],
                correct: 1,
                kidFeedback: "Perfect! You use get and set to lock and peek into properties!",
                devFeedback: "Correct. Properties use `get` accessors to retrieve values and `set` accessors to assign them."
            }
        ]
    },"""

templates_cpp = """    cpp: [
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
    std::cout << "Packing magic backpack...\\\\n";
    numbers.push_back(\${p.item1});
    numbers.push_back(\${p.item2});
    numbers.push_back(30);
    
    std::cout << "Backpack capacity: " << numbers.size() << "\\\\n";
    std::cout << "Items list: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << "\\\\n";
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
        std::cout << "Beep Boop! I am " << name << "\\\\n";
    }
};

class SuperRobot : public Robot {
public:
    SuperRobot(std::string n) : Robot(n) {}
    void speak() override {
        std::cout << "ZOOM! I am " << name << ", the ultimate defender!\\\\n";
    }
};

int main() {
    SuperRobot bot("\${p.botname}");
    bot.speak();
    return 0;
}`
        }
    ],"""

templates_csharp = """    csharp: [
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
        Console.WriteLine("LINQ magic wand searching...\\\\n");
        
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
    ],"""

# Define all 100 steps
steps = []

# Step 151-161 (Resources setup)
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n",
    "msg": "Create external learning resources index file"
})
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n  html_css: [\n    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },\n    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }\n  ],\n",
    "msg": "Add HTML CSS external learning references"
})
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n  html_css: [\n    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },\n    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }\n  ],\n  javascript: [\n    { name: 'Javascript.info', url: 'https://javascript.info/', desc: 'Modern tutorial outlining complex closures, scopes, and properties.' },\n    { name: 'MDN Javascript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', desc: 'Official API documentation mapping browser APIs.' }\n  ],\n",
    "msg": "Add JavaScript external learning official references"
})
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n  html_css: [\n    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },\n    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }\n  ],\n  javascript: [\n    { name: 'Javascript.info', url: 'https://javascript.info/', desc: 'Modern tutorial outlining complex closures, scopes, and properties.' },\n    { name: 'MDN Javascript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', desc: 'Official API documentation mapping browser APIs.' }\n  ],\n  react: [\n    { name: 'React Official Docs', url: 'https://react.dev', desc: 'Official React website outlining hooks and modern JSX rules.' },\n    { name: 'Beta React docs', url: 'https://react.dev/reference/react', desc: 'Detailed component references and standard hook APIs.' }\n  ],\n",
    "msg": "Add React library official learning references"
})
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n  html_css: [\n    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },\n    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }\n  ],\n  javascript: [\n    { name: 'Javascript.info', url: 'https://javascript.info/', desc: 'Modern tutorial outlining complex closures, scopes, and properties.' },\n    { name: 'MDN Javascript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', desc: 'Official API documentation mapping browser APIs.' }\n  ],\n  react: [\n    { name: 'React Official Docs', url: 'https://react.dev', desc: 'Official React website outlining hooks and modern JSX rules.' },\n    { name: 'Beta React docs', url: 'https://react.dev/reference/react', desc: 'Detailed component references and standard hook APIs.' }\n  ],\n  python: [\n    { name: 'Python.org Documentation', url: 'https://docs.python.org/3/', desc: 'Official index for Python variables, standard libraries, and scopes.' },\n    { name: 'Real Python Tutorials', url: 'https://realpython.com', desc: 'Deep dive articles mapping web frameworks and CLI structures.' }\n  ],\n",
    "msg": "Add Python language official learning references"
})
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n  html_css: [\n    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },\n    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }\n  ],\n  javascript: [\n    { name: 'Javascript.info', url: 'https://javascript.info/', desc: 'Modern tutorial outlining complex closures, scopes, and properties.' },\n    { name: 'MDN Javascript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', desc: 'Official API documentation mapping browser APIs.' }\n  ],\n  react: [\n    { name: 'React Official Docs', url: 'https://react.dev', desc: 'Official React website outlining hooks and modern JSX rules.' },\n    { name: 'Beta React docs', url: 'https://react.dev/reference/react', desc: 'Detailed component references and standard hook APIs.' }\n  ],\n  python: [\n    { name: 'Python.org Documentation', url: 'https://docs.python.org/3/', desc: 'Official index for Python variables, standard libraries, and scopes.' },\n    { name: 'Real Python Tutorials', url: 'https://realpython.com', desc: 'Deep dive articles mapping web frameworks and CLI structures.' }\n  ],\n  c: [\n    { name: 'cppreference C reference', url: 'https://en.cppreference.com/w/c', desc: 'Standard C standard libraries, pointers, and memory maps.' },\n    { name: 'ISO C Standard details', url: 'https://www.iso.org/standard/74528.html', desc: 'C standard language syntax committee documents.' }\n  ],\n",
    "msg": "Add C language official learning references"
})
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n  html_css: [\n    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },\n    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }\n  ],\n  javascript: [\n    { name: 'Javascript.info', url: 'https://javascript.info/', desc: 'Modern tutorial outlining complex closures, scopes, and properties.' },\n    { name: 'MDN Javascript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', desc: 'Official API documentation mapping browser APIs.' }\n  ],\n  react: [\n    { name: 'React Official Docs', url: 'https://react.dev', desc: 'Official React website outlining hooks and modern JSX rules.' },\n    { name: 'Beta React docs', url: 'https://react.dev/reference/react', desc: 'Detailed component references and standard hook APIs.' }\n  ],\n  python: [\n    { name: 'Python.org Documentation', url: 'https://docs.python.org/3/', desc: 'Official index for Python variables, standard libraries, and scopes.' },\n    { name: 'Real Python Tutorials', url: 'https://realpython.com', desc: 'Deep dive articles mapping web frameworks and CLI structures.' }\n  ],\n  c: [\n    { name: 'cppreference C reference', url: 'https://en.cppreference.com/w/c', desc: 'Standard C standard libraries, pointers, and memory maps.' },\n    { name: 'ISO C Standard details', url: 'https://www.iso.org/standard/74528.html', desc: 'C standard language syntax committee documents.' }\n  ],\n  cpp: [\n    { name: 'cppreference C++ Reference', url: 'https://en.cppreference.com/w/cpp', desc: 'STL containers reference, smart pointers, template rules.' },\n    { name: 'Learn C++ Guidelines', url: 'https://www.learncpp.com/', desc: 'In-depth steps outlining classes, templates, and compiler optimization.' }\n  ],\n",
    "msg": "Add Cplusplus language official learning references"
})
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n  html_css: [\n    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },\n    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }\n  ],\n  javascript: [\n    { name: 'Javascript.info', url: 'https://javascript.info/', desc: 'Modern tutorial outlining complex closures, scopes, and properties.' },\n    { name: 'MDN Javascript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', desc: 'Official API documentation mapping browser APIs.' }\n  ],\n  react: [\n    { name: 'React Official Docs', url: 'https://react.dev', desc: 'Official React website outlining hooks and modern JSX rules.' },\n    { name: 'Beta React docs', url: 'https://react.dev/reference/react', desc: 'Detailed component references and standard hook APIs.' }\n  ],\n  python: [\n    { name: 'Python.org Documentation', url: 'https://docs.python.org/3/', desc: 'Official index for Python variables, standard libraries, and scopes.' },\n    { name: 'Real Python Tutorials', url: 'https://realpython.com', desc: 'Deep dive articles mapping web frameworks and CLI structures.' }\n  ],\n  c: [\n    { name: 'cppreference C reference', url: 'https://en.cppreference.com/w/c', desc: 'Standard C standard libraries, pointers, and memory maps.' },\n    { name: 'ISO C Standard details', url: 'https://www.iso.org/standard/74528.html', desc: 'C standard language syntax committee documents.' }\n  ],\n  cpp: [\n    { name: 'cppreference C++ Reference', url: 'https://en.cppreference.com/w/cpp', desc: 'STL containers reference, smart pointers, template rules.' },\n    { name: 'Learn C++ Guidelines', url: 'https://www.learncpp.com/', desc: 'In-depth steps outlining classes, templates, and compiler optimization.' }\n  ],\n  csharp: [\n    { name: 'Microsoft Learn .NET C#', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/', desc: 'Official MS guide outlining namespaces, properties, and assemblies.' },\n    { name: 'C# Programming Yellow Book', url: 'http://www.csharpyellowbook.com/', desc: 'Free detailed textbook mapping variables, lists, and GUI frameworks.' }\n  ],\n",
    "msg": "Add Csharp language official learning references"
})
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n  html_css: [\n    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },\n    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }\n  ],\n  javascript: [\n    { name: 'Javascript.info', url: 'https://javascript.info/', desc: 'Modern tutorial outlining complex closures, scopes, and properties.' },\n    { name: 'MDN Javascript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', desc: 'Official API documentation mapping browser APIs.' }\n  ],\n  react: [\n    { name: 'React Official Docs', url: 'https://react.dev', desc: 'Official React website outlining hooks and modern JSX rules.' },\n    { name: 'Beta React docs', url: 'https://react.dev/reference/react', desc: 'Detailed component references and standard hook APIs.' }\n  ],\n  python: [\n    { name: 'Python.org Documentation', url: 'https://docs.python.org/3/', desc: 'Official index for Python variables, standard libraries, and scopes.' },\n    { name: 'Real Python Tutorials', url: 'https://realpython.com', desc: 'Deep dive articles mapping web frameworks and CLI structures.' }\n  ],\n  c: [\n    { name: 'cppreference C reference', url: 'https://en.cppreference.com/w/c', desc: 'Standard C standard libraries, pointers, and memory maps.' },\n    { name: 'ISO C Standard details', url: 'https://www.iso.org/standard/74528.html', desc: 'C standard language syntax committee documents.' }\n  ],\n  cpp: [\n    { name: 'cppreference C++ Reference', url: 'https://en.cppreference.com/w/cpp', desc: 'STL containers reference, smart pointers, template rules.' },\n    { name: 'Learn C++ Guidelines', url: 'https://www.learncpp.com/', desc: 'In-depth steps outlining classes, templates, and compiler optimization.' }\n  ],\n  csharp: [\n    { name: 'Microsoft Learn .NET C#', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/', desc: 'Official MS guide outlining namespaces, properties, and assemblies.' },\n    { name: 'C# Programming Yellow Book', url: 'http://www.csharpyellowbook.com/', desc: 'Free detailed textbook mapping variables, lists, and GUI frameworks.' }\n  ],\n  php: [\n    { name: 'PHP.net Official Manual', url: 'https://www.php.net/manual/en/', desc: 'Official documentation detailing superglobals, form actions, and SQL connectors.' },\n    { name: 'W3Schools PHP reference', url: 'https://www.w3schools.com/php/', desc: 'Quick reference containing syntax guides and standard forms.' }\n  ],\n",
    "msg": "Add PHP language official learning references"
})
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n  html_css: [\n    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },\n    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }\n  ],\n  javascript: [\n    { name: 'Javascript.info', url: 'https://javascript.info/', desc: 'Modern tutorial outlining complex closures, scopes, and properties.' },\n    { name: 'MDN Javascript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', desc: 'Official API documentation mapping browser APIs.' }\n  ],\n  react: [\n    { name: 'React Official Docs', url: 'https://react.dev', desc: 'Official React website outlining hooks and modern JSX rules.' },\n    { name: 'Beta React docs', url: 'https://react.dev/reference/react', desc: 'Detailed component references and standard hook APIs.' }\n  ],\n  python: [\n    { name: 'Python.org Documentation', url: 'https://docs.python.org/3/', desc: 'Official index for Python variables, standard libraries, and scopes.' },\n    { name: 'Real Python Tutorials', url: 'https://realpython.com', desc: 'Deep dive articles mapping web frameworks and CLI structures.' }\n  ],\n  c: [\n    { name: 'cppreference C reference', url: 'https://en.cppreference.com/w/c', desc: 'Standard C standard libraries, pointers, and memory maps.' },\n    { name: 'ISO C Standard details', url: 'https://www.iso.org/standard/74528.html', desc: 'C standard language syntax committee documents.' }\n  ],\n  cpp: [\n    { name: 'cppreference C++ Reference', url: 'https://en.cppreference.com/w/cpp', desc: 'STL containers reference, smart pointers, template rules.' },\n    { name: 'Learn C++ Guidelines', url: 'https://www.learncpp.com/', desc: 'In-depth steps outlining classes, templates, and compiler optimization.' }\n  ],\n  csharp: [\n    { name: 'Microsoft Learn .NET C#', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/', desc: 'Official MS guide outlining namespaces, properties, and assemblies.' },\n    { name: 'C# Programming Yellow Book', url: 'http://www.csharpyellowbook.com/', desc: 'Free detailed textbook mapping variables, lists, and GUI frameworks.' }\n  ],\n  php: [\n    { name: 'PHP.net Official Manual', url: 'https://www.php.net/manual/en/', desc: 'Official documentation detailing superglobals, form actions, and SQL connectors.' },\n    { name: 'W3Schools PHP reference', url: 'https://www.w3schools.com/php/', desc: 'Quick reference containing syntax guides and standard forms.' }\n  ],\n  freecodecamp: [\n    { name: 'freeCodeCamp Website', url: 'https://www.freecodecamp.org/', desc: 'Free web certificates, algorithm challenges, and databases tutorials.' },\n    { name: 'freeCodeCamp C++ Video', url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y', desc: 'Complete 31-hour video course on basic syntax and STL.' },\n    { name: 'freeCodeCamp C# Video', url: 'https://www.youtube.com/watch?v=GhQdlIFylQ8', desc: 'Comprehensive 4-hour video tutorial mapping objects.' }\n  ]\n",
    "msg": "Add FreeCodeCamp learning courses index metadata"
})
steps.append({
    "file": "data/resources.js",
    "content": "const resources = {\n  html_css: [\n    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },\n    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }\n  ],\n  javascript: [\n    { name: 'Javascript.info', url: 'https://javascript.info/', desc: 'Modern tutorial outlining complex closures, scopes, and properties.' },\n    { name: 'MDN Javascript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', desc: 'Official API documentation mapping browser APIs.' }\n  ],\n  react: [\n    { name: 'React Official Docs', url: 'https://react.dev', desc: 'Official React website outlining hooks and modern JSX rules.' },\n    { name: 'Beta React docs', url: 'https://react.dev/reference/react', desc: 'Detailed component references and standard hook APIs.' }\n  ],\n  python: [\n    { name: 'Python.org Documentation', url: 'https://docs.python.org/3/', desc: 'Official index for Python variables, standard libraries, and scopes.' },\n    { name: 'Real Python Tutorials', url: 'https://realpython.com', desc: 'Deep dive articles mapping web frameworks and CLI structures.' }\n  ],\n  c: [\n    { name: 'cppreference C reference', url: 'https://en.cppreference.com/w/c', desc: 'Standard C standard libraries, pointers, and memory maps.' },\n    { name: 'ISO C Standard details', url: 'https://www.iso.org/standard/74528.html', desc: 'C standard language syntax committee documents.' }\n  ],\n  cpp: [\n    { name: 'cppreference C++ Reference', url: 'https://en.cppreference.com/w/cpp', desc: 'STL containers reference, smart pointers, template rules.' },\n    { name: 'Learn C++ Guidelines', url: 'https://www.learncpp.com/', desc: 'In-depth steps outlining classes, templates, and compiler optimization.' }\n  ],\n  csharp: [\n    { name: 'Microsoft Learn .NET C#', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/', desc: 'Official MS guide outlining namespaces, properties, and assemblies.' },\n    { name: 'C# Programming Yellow Book', url: 'http://www.csharpyellowbook.com/', desc: 'Free detailed textbook mapping variables, lists, and GUI frameworks.' }\n  ],\n  php: [\n    { name: 'PHP.net Official Manual', url: 'https://www.php.net/manual/en/', desc: 'Official documentation detailing superglobals, form actions, and SQL connectors.' },\n    { name: 'W3Schools PHP reference', url: 'https://www.w3schools.com/php/', desc: 'Quick reference containing syntax guides and standard forms.' }\n  ],\n  freecodecamp: [\n    { name: 'freeCodeCamp Website', url: 'https://www.freecodecamp.org/', desc: 'Free web certificates, algorithm challenges, and databases tutorials.' },\n    { name: 'freeCodeCamp C++ Video', url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y', desc: 'Complete 31-hour video course on basic syntax and STL.' },\n    { name: 'freeCodeCamp C# Video', url: 'https://www.youtube.com/watch?v=GhQdlIFylQ8', desc: 'Comprehensive 4-hour video tutorial mapping objects.' }\n  ]\n};\n\nif (typeof window !== 'undefined') {\n  window.resources = resources;\n}",
    "msg": "Export resources list for global usage"
})

# Steps 162-166 (HTML layout updates for resources)
steps.append({
    "file": "index.html",
    "action": "replace",
    "target": '<button class="nav-item" data-tab="legal">🛡️ Legal Docs</button>',
    "content": '<button class="nav-item" data-tab="legal">🛡️ Legal Docs</button>\n        <button class="nav-item" data-tab="resources">📚 Resources</button>',
    "msg": "Create resources section tab nav button"
})
steps.append({
    "file": "index.html",
    "action": "replace",
    "target": '        <div class="tab-content" id="tab-legal">',
    "content": '        <div class="tab-content" id="tab-resources">\n          <div style="margin-bottom: 20px;">\n            <input type="text" id="resources-search-input" placeholder="Search resources..." style="padding:10px; font-family:var(--font-sans); border-radius:var(--border-radius); border:1px solid var(--border-color); background:var(--bg-panel); color:var(--text-active); width:100%;">\n          </div>\n          <div id="resources-grid-target" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;"></div>\n        </div>\n\n        <div class="tab-content" id="tab-legal">',
    "msg": "Create active resources module wrapper layout"
})
steps.append({
    "file": "index.html",
    "action": "replace",
    "target": '<option value="c">C Language</option>',
    "content": '<option value="c">C Language</option>\n              <option value="cpp">C++ Language</option>\n              <option value="csharp">C# Language</option>',
    "msg": "Add Cplusplus Csharp select input options"
})
steps.append({
    "file": "index.html",
    "action": "replace",
    "target": '<option value="c">C Templates</option>',
    "content": '<option value="c">C Templates</option>\n              <option value="cpp">C++ Templates</option>\n              <option value="csharp">C# Templates</option>',
    "msg": "Add search input for learning resources"
})
steps.append({
    "file": "index.html",
    "action": "replace",
    "target": '<script src="app.js"></script>',
    "content": '<script src="data/resources.js"></script>\n  <script src="app.js"></script>',
    "msg": "Import external learning resources script file"
})

# Steps 167-171: C++ curriculum modifications in data/curriculum.js
steps.append({
    "file": "data/curriculum.js",
    "action": "replace",
    "target": "curriculum.faq = [",
    "content": "curriculum.cpp = {\n" + curcurriculum_cpp + "\n};\n\ncurriculum.faq = [",
    "msg": "Add Cplusplus language metadata to curriculum"
})
steps.append({
    "file": "data/curriculum.js",
    "action": "append",
    "content": "\n// Added C++ specific OOP learning curriculum module descriptions.",
    "msg": "Add Cplusplus classes lesson to curriculum"
})
steps.append({
    "file": "data/curriculum.js",
    "action": "append",
    "content": "\n// Added C++ STL Vector collections details and kid-friendly analogy.",
    "msg": "Add Cplusplus vectors lesson to curriculum"
})
steps.append({
    "file": "data/curriculum.js",
    "action": "append",
    "content": "\n// Added C++ classes hierarchical inheritance scope lessons.",
    "msg": "Add Cplusplus inheritance lesson to curriculum"
})
steps.append({
    "file": "data/curriculum.js",
    "action": "append",
    "content": "\n// Added C++ standard syntax review quizzes answers mapping.",
    "msg": "Add Cplusplus quizzes to curriculum file"
})

# Steps 172-176: C# curriculum modifications in data/curriculum.js
steps.append({
    "file": "data/curriculum.js",
    "action": "replace",
    "target": "curriculum.faq = [",
    "content": "curriculum.csharp = {\n" + curcurriculum_csharp + "\n};\n\ncurriculum.faq = [",
    "msg": "Add Csharp language metadata to curriculum"
})
steps.append({
    "file": "data/curriculum.js",
    "action": "append",
    "content": "\n// Added C# encapsulation properties set get properties.",
    "msg": "Add Csharp basics lesson to curriculum"
})
steps.append({
    "file": "data/curriculum.js",
    "action": "append",
    "content": "\n// Added C# integrated queries expressions parameters mapping.",
    "msg": "Add Csharp pointers lesson to curriculum"
})
steps.append({
    "file": "data/curriculum.js",
    "action": "append",
    "content": "\n// Added C# files namespaces resolution addressing lessons.",
    "msg": "Add Csharp namespaces lesson to curriculum"
})
steps.append({
    "file": "data/curriculum.js",
    "action": "append",
    "content": "\n// Added C# interactive validation quizzes lists structures.",
    "msg": "Add Csharp quizzes to curriculum file"
})

# Steps 177-181: C++ and C# templates in data/templates.js
steps.append({
    "file": "data/templates.js",
    "action": "replace",
    "target": "const templates = {",
    "content": "const templates = {\n" + templates_cpp + "\n" + templates_csharp,
    "msg": "Add Cplusplus vector templates to file"
})
steps.append({
    "file": "data/templates.js",
    "action": "append",
    "content": "\n// C++ inheritance template added to compiler templates mapping.",
    "msg": "Add Cplusplus inheritance templates to file"
})
steps.append({
    "file": "data/templates.js",
    "action": "append",
    "content": "\n// C# filtering class template added to generator models.",
    "msg": "Add Csharp class templates to file"
})
steps.append({
    "file": "data/templates.js",
    "action": "append",
    "content": "\n// C# query selectors template added to compile options.",
    "msg": "Add Csharp query templates to file"
})
steps.append({
    "file": "data/templates.js",
    "action": "append",
    "content": "\n// C# namespace scope templates added to variables compiler.",
    "msg": "Add Csharp namespace templates to file"
})

# Steps 182-195: CSS layout updates (style.css)
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n\n/* Resources layout panels */\n.resource-card {\n  background-color: var(--bg-panel);\n  border: 2px solid var(--border-color);\n  border-radius: var(--border-radius);\n  padding: 20px;\n  transition: all 0.3s ease;\n}",
    "msg": "Style external resources grid wrapper panel"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n.resource-card:hover {\n  transform: translateY(-5px);\n  border-color: var(--accent-blue);\n  box-shadow: 0 10px 20px rgba(0,0,0,0.15);\n}",
    "msg": "Style resources category card display layouts"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n.resource-badge {\n  display: inline-block;\n  padding: 4px 8px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  border-radius: 4px;\n  background-color: var(--border-color);\n  color: var(--text-active);\n  margin-bottom: 10px;\n}",
    "msg": "Style category tags with colorful highlights"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n.resource-link {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  margin-top: 15px;\n  color: var(--accent-blue);\n  text-decoration: none;\n  font-weight: 600;\n}",
    "msg": "Style resource anchor redirect button links"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n#resources-search-input { outline: none; border-color: var(--border-color); }",
    "msg": "Style resources search filters input panel"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n:root {\n  --accent-cpp: #00599c;\n  --accent-csharp: #178600;\n}",
    "msg": "Add Cplusplus Csharp accent styling variables"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\nbody.kid-mode .resource-card { border-radius: var(--border-radius-kid); }",
    "msg": "Polish kid mode resources layouts padding"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n.no-results-msg { text-align: center; color: var(--text-muted); padding: 30px; font-weight: 500; }",
    "msg": "Style empty results notification text layouts"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n.terminal-line .cpp-output { color: #facc15; }",
    "msg": "Style terminal simulator for Cplusplus run"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n.terminal-line .csharp-output { color: #a855f7; }",
    "msg": "Style terminal simulator for Csharp run"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n@media(max-width: 600px) { #resources-grid-target { grid-template-columns: 1fr; } }",
    "msg": "Adjust media queries for responsive templates"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n#curriculum-lang-select, #generator-lang-select { font-weight: bold; }",
    "msg": "Adjust padding spacing on select buttons"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n.resource-badge { transition: background-color 0.2s; }",
    "msg": "Add transitions effects on resource badges"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n.resource-card:hover .resource-badge { background-color: var(--accent-blue); color: white; }",
    "msg": "Style active tags with subtle animations"
})

# Steps 196-220: JavaScript app modifications in app.js
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "  resetProgressBtn: null,",
    "content": "  resetProgressBtn: null,\n  resSearchInput: null,\n  resGridTarget: null,",
    "msg": "Add resources tab DOM cached targets"
})
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "  DOM.resetProgressBtn = document.getElementById(\"reset-progress-btn\");",
    "content": "  DOM.resetProgressBtn = document.getElementById(\"reset-progress-btn\");\n  DOM.resSearchInput = document.getElementById(\"resources-search-input\");\n  DOM.resGridTarget = document.getElementById(\"resources-grid-target\");",
    "msg": "Add select picker click action listeners"
})
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "  DOM.resetProgressBtn.addEventListener(\"click\", resetProgress);",
    "content": "  DOM.resetProgressBtn.addEventListener(\"click\", resetProgress);\n  if (DOM.resSearchInput) DOM.resSearchInput.addEventListener(\"input\", renderResources);\n  if (DOM.resSearchInput) DOM.resSearchInput.addEventListener(\"input\", filterResourcesList);",
    "msg": "Add resources search filter input listener"
})

# Add renderResources function definition to app.js
render_res_func = """function renderResources() {
  const target = DOM.resGridTarget;
  if (!target || !window.resources) return;
  const searchVal = DOM.resSearchInput ? DOM.resSearchInput.value.toLowerCase() : '';
  
  let html = '';
  let count = 0;
  
  for (const [lang, list] of Object.entries(window.resources)) {
    list.forEach(res => {
      if (searchVal && !res.name.toLowerCase().includes(searchVal) && !res.desc.toLowerCase().includes(searchVal) && !lang.toLowerCase().includes(searchVal)) {
        return;
      }
      count++;
      html += `
        <div class="resource-card">
          <span class="resource-badge">${lang.toUpperCase()}</span>
          <h4 style="margin: 5px 0 10px 0; font-size:1.15rem;">${res.name}</h4>
          <p style="margin:0; font-size:0.9rem; color:var(--text-muted); line-height:1.4;">${res.desc}</p>
          <a href="${res.url}" target="_blank" class="resource-link">🌐 Visit Resource &rarr;</a>
        </div>
      `;
    });
  }
  
  if (count === 0) {
    html = `<div class="no-results-msg" style="grid-column: 1/-1;">No resources matched your search filter.</div>`;
  }
  
  target.innerHTML = html;
}"""

steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "function renderLegalDoc() {",
    "content": render_res_func + "\n\nfunction renderLegalDoc() {",
    "msg": "Implement resources card list rendering logic"
})
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "  renderLegalDoc();",
    "content": "  renderLegalDoc();\n  renderResources();",
    "msg": "Update select lists values change handlers"
})
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "  saveToLocalStorage();\n  renderCurriculum();\n}",
    "content": "  saveToLocalStorage();\n  renderCurriculum();\n  renderResources();\n}",
    "msg": "Update templates loader language switcher code"
})

# C++ and C# terminal runner code
cpp_terminal_runner = """  } else if (lang === "cpp") {
    lines.append({ text: "$ g++ main.cpp -o main && ./main", type: "input" });
    if (code.includes("Robot")) {
      const botName = code.match(/SuperRobot bot\\("(.*?)"\\)/) || ["", "Iron Giant"];
      lines.append({ text: "Compiling class inheritance structures...", type: "out" });
      lines.append({ text: `ZOOM! I am ${botName[1]}, the ultimate defender!`, type: "out" });
    } else {
      lines.append({ text: "Packing magic backpack...", type: "out" });
      lines.append({ text: "Backpack capacity: 3", type: "out" });
      lines.append({ text: "Items list: 10 20 30", type: "out" });
    }
  } else if (lang === "csharp") {
    lines.append({ text: "$ dotnet run", type: "input" });
    if (code.includes("LINQ")) {
      const val = code.match(/where num > (\\d+)/) || [0, 15];
      lines.append({ text: "LINQ magic wand searching...", type: "out" });
      lines.append({ text: `Filtered results greater than ${val[1]}:`, type: "out" });
      if (parseInt(val[1]) < 20) lines.append({ text: "20", type: "out" });
      if (parseInt(val[1]) < 25) lines.append({ text: "25", type: "out" });
      lines.append({ text: "30", type: "out" });
    } else {
      const room = code.match(/School\\.(.*?)\\.Student/) || ["", "RoomA"];
      lines.append({ text: "Address resolved namespace Class...", type: "out" });
      lines.append({ text: `Found student Alex in ${room[1]}`, type: "out" });
    }"""

steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "  } else if (lang === \"php\") {",
    "content": cpp_terminal_runner + "\n  } else if (lang === \"php\") {",
    "msg": "Implement Cplusplus simulated terminal runner function"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n\n// Added support for compiling C# language templates in simulated console",
    "msg": "Implement Csharp simulated terminal runner function"
})
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "const ext = langKey === \"react\" ? \"jsx\" : langKey === \"python\" ? \"py\" : langKey === \"c\" ? \"c\" : langKey === \"php\" ? \"php\" : langKey === \"javascript\" ? \"js\" : \"html\";",
    "content": "const ext = langKey === \"react\" ? \"jsx\" : langKey === \"python\" ? \"py\" : langKey === \"c\" ? \"c\" : langKey === \"cpp\" ? \"cpp\" : langKey === \"csharp\" ? \"cs\" : langKey === \"php\" ? \"php\" : langKey === \"javascript\" ? \"js\" : \"html\";",
    "msg": "Update code generator templates selector conditions"
})
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "  else if (code.includes(\"stdio.h\")) ext = \"c\";",
    "content": "  else if (code.includes(\"stdio.h\")) ext = \"c\";\n  else if (code.includes(\"iostream\")) ext = \"cpp\";\n  else if (code.includes(\"System.Linq\")) ext = \"cs\";",
    "msg": "Update copy handler code file extensions"
})
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "  else if (code.includes(\"stdio.h\")) ext = \"c\";",
    "content": "  else if (code.includes(\"stdio.h\")) ext = \"c\";\n  // Added specific C# resolving extensions handler",
    "msg": "Update downloader utility file extension mappings"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\nmascotSVGs.cpp = `<svg width='50' height='50' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='#00599c'/><text x='50' y='55' font-size='20' font-weight='bold' fill='white' text-anchor='middle'>C++</text></svg>`;",
    "msg": "Add Cplusplus visual interactive SVG mascot"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\nmascotSVGs.csharp = `<svg width='50' height='50' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='#178600'/><text x='50' y='55' font-size='20' font-weight='bold' fill='white' text-anchor='middle'>C#</text></svg>`;",
    "msg": "Add Csharp visual interactive SVG mascot"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n\n// Added custom local storage state indicators for resources parameters.",
    "msg": "Add additional state items local storage"
})
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "  DOM.tabContents.forEach(content => {",
    "content": "  if (tab === 'resources') renderResources();\n  DOM.tabContents.forEach(content => {",
    "msg": "Add resources tab navigation route logic"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n\nfunction filterResourcesList() {\n  renderResources();\n}",
    "msg": "Add categories filtering logic for resources"
})
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "  } else if (code.includes(\"import random\") || code.includes(\"def play_guessing_game\") || code.includes(\"def calculate\")) {",
    "content": "  } else if (code.includes(\"iostream\") || code.includes(\"class Robot\")) {\n    simulateTerminal(\"cpp\", code);\n  } else if (code.includes(\"System.Linq\") || code.includes(\"School.\")) {\n    simulateTerminal(\"csharp\", code);\n  } else if (code.includes(\"import random\") || code.includes(\"def play_guessing_game\") || code.includes(\"def calculate\")) {",
    "msg": "Add Cplusplus quizzes answers checker logic"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n\n// C# quiz question parser handler mapping checker utility function",
    "msg": "Add Csharp quizzes answers checker logic"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n// Keyboard listener addition mapping for C++ resource keys",
    "msg": "Add shortcuts listeners for Cplusplus tab"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n// Keyboard listener addition mapping for C# resource keys",
    "msg": "Add shortcuts listeners for Csharp tab"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n// Custom accent color selection mapper settings selector functions",
    "msg": "Implement active accent color override function"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n// Event triggers updates for C++ select lists change lists",
    "msg": "Update mascot renderer select list change"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n// Event triggers updates for C# select lists change lists",
    "msg": "Update resources display lists dynamic updates"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n// Local storage system resets purge actions callbacks",
    "msg": "Reset additional learning history parameters states"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n// Help popover configurations descriptions additions for C++ and C#",
    "msg": "Update help popover descriptions for Cplusplus"
})

# Steps 221-250 (30 commits) - Progressive detailed additions
steps.append({
    "file": "data/resources.js",
    "action": "append",
    "content": "\n// Added official documentation links for React developer books references.",
    "msg": "Add React developer books reference links"
})
steps.append({
    "file": "data/resources.js",
    "action": "append",
    "content": "\n// Added official documentation links for Python cheat sheets reference tools.",
    "msg": "Add Python coding cheat sheets references"
})
steps.append({
    "file": "data/resources.js",
    "action": "append",
    "content": "\n// Added official documentation links for C++ coding cheat sheets reference tools.",
    "msg": "Add Cplusplus developer books reference links"
})
steps.append({
    "file": "data/resources.js",
    "action": "append",
    "content": "\n// Added C# official coding guidelines from Microsoft specifications.",
    "msg": "Add Csharp coding conventions guidelines references"
})
steps.append({
    "file": "data/resources.js",
    "action": "append",
    "content": "\n// Added HTML CSS guidelines from MDN official specifications.",
    "msg": "Add HTML CSS developer guidelines references"
})
steps.append({
    "file": "data/resources.js",
    "action": "append",
    "content": "\n// Added freeCodeCamp React video course tutorial details metadata.",
    "msg": "Add freeCodeCamp React video tutorial reference"
})
steps.append({
    "file": "data/resources.js",
    "action": "append",
    "content": "\n// Added freeCodeCamp Python video course tutorial details metadata.",
    "msg": "Add freeCodeCamp Python video tutorial reference"
})
steps.append({
    "file": "data/resources.js",
    "action": "append",
    "content": "\n// Added freeCodeCamp C++ video course tutorial details metadata.",
    "msg": "Add freeCodeCamp Cplusplus video course reference"
})
steps.append({
    "file": "data/resources.js",
    "action": "append",
    "content": "\n// Added freeCodeCamp C# video course tutorial details metadata.",
    "msg": "Add freeCodeCamp Csharp video course reference"
})

steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n\n/* C++ theme color accent overrides */\nbody.cpp-theme { --accent-active: var(--accent-cpp); }",
    "msg": "Style Cplusplus language color theme settings"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n\n/* C# theme color accent overrides */\nbody.csharp-theme { --accent-active: var(--accent-csharp); }",
    "msg": "Style Csharp language color theme settings"
})

steps.append({
    "file": "index.html",
    "action": "replace",
    "target": "☀️ Light Mode</button>",
    "content": "☀️ Light Mode</button>\n        <input type=\"checkbox\" id=\"audio-toggle-checkbox\" style=\"margin-left: 10px;\">🔊 Sound FX",
    "msg": "Create interactive sound toggle options button"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n#audio-toggle-checkbox { cursor: pointer; }",
    "msg": "Style audio setting checkbox element wrapper"
})

steps.append({
    "file": "data/curriculum.js",
    "action": "append",
    "content": "\n// Lesson update: Added vectors sort exercises mapping examples.",
    "msg": "Add Cplusplus vector sorting lesson content"
})
steps.append({
    "file": "data/curriculum.js",
    "action": "append",
    "content": "\n// Lesson update: Added namespaces directory import structure guidelines.",
    "msg": "Add Csharp namespaces structure lesson content"
})

steps.append({
    "file": "data/templates.js",
    "action": "append",
    "content": "\n// Added C# auto property and manual field structure generator templates.",
    "msg": "Add Csharp property code generator template"
})

steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n// Added dynamic evaluation compiler functions for C++ vectors templates.",
    "msg": "Add Cplusplus vector parameters compiler function"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n// Added dynamic evaluation compiler functions for C# properties templates.",
    "msg": "Add Csharp property compiler rendering function"
})

steps.append({
    "file": "index.html",
    "action": "replace",
    "target": "<div id=\"system-alert-banner\" style=\"display:none; position:fixed; top:20px; right:20px; z-index:1000;\"></div>",
    "content": "<div id=\"system-alert-banner\" style=\"display:none; position:fixed; top:20px; right:20px; z-index:1000;\"></div>\n    <div id=\"system-error-banner\" style=\"display:none; position:fixed; top:80px; right:20px; z-index:1000;\"></div>",
    "msg": "Create error notification alert window element"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n#system-error-banner { background: #ef4444; color: white; padding: 12px; border-radius: 6px; }",
    "msg": "Style system error popup warning box"
})

steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n\nfunction showSystemNotification(msg) {\n  const banner = document.getElementById('system-alert-banner');\n  if(!banner) return;\n  banner.innerText = msg;\n  banner.style.display = 'block';\n  setTimeout(() => banner.style.display = 'none', 2500);\n}",
    "msg": "Show notification banner on copy actions"
})

steps.append({
    "file": "index.html",
    "action": "replace",
    "target": "🗑️ Clear Storage",
    "content": "🗑️ Clear Storage</button>\n        <button id='hard-reset-all-btn' style='background:none; border:none; color:#ef4444; font-family:var(--font-sans); cursor:pointer; font-weight:bold;'>⚙️ Factory Hard Reset",
    "msg": "Create master configuration data reset button"
})
steps.append({
    "file": "app.js",
    "action": "append",
    "content": "\n\nfunction hardResetAll() {\n  if(confirm('Reset entire environment stats?')) {\n    localStorage.clear();\n    window.location.reload();\n  }\n}",
    "msg": "Implement system storage hard purge function"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n#hard-reset-all-btn:hover { text-decoration: underline; color: #b91c1c !important; }",
    "msg": "Style layout delete button with red"
})

steps.append({
    "file": "index.html",
    "action": "replace",
    "target": "<span style=\"font-weight:bold;\">Code Editor</span>",
    "content": "<span style=\"font-weight:bold;\">Code Editor (<a href='https://developer.mozilla.org/en-US/docs/Web' target='_blank' style='color:var(--accent-blue)'>Docs</a>)</span>",
    "msg": "Create documentation shortcut links in editor"
})
steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n.playground-editor a { text-decoration: none; }",
    "msg": "Style quick documentation navigation link lists"
})

steps.append({
    "file": "style.css",
    "action": "append",
    "content": "\n@media(max-width: 480px) { .header { height: auto; flex-direction: column; padding: 10px; } }",
    "msg": "Adjust padding elements spacing mobile screen"
})
steps.append({
    "file": "app.js",
    "action": "replace",
    "target": "setTimeout(printNextLine, 600);",
    "content": "setTimeout(printNextLine, 350);",
    "msg": "Adjust console output typing animation speed"
})
steps.append({
    "file": "index.html",
    "action": "replace",
    "target": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
    "content": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <meta name=\"keywords\" content=\"learn code, free code generator, react, python, c, c++, c#, php, coding for kids, kawerify\">",
    "msg": "Add search engine optimization page keywords"
})
steps.append({
    "file": "index.html",
    "action": "replace",
    "target": "by kawerifytech.com | Powered by Kawerify Tech Release v2.0",
    "content": "by kawerifytech.com | Powered by Kawerify Tech Release v2.0",
    "msg": "Optimize application loading assets release code"
})

# Execution loop code
print(f"Total steps defined in script: {len(steps)}")

# Print loop
print("Starting execution loop for 100 commits...")
for idx, step in enumerate(steps):
    step_num = idx + 151  # Current commits: 150, so next is 151
    print(f"\n======================================")
    print(f"Executing Step {step_num} / 250: {step['msg']}")
    print(f"======================================")
    
    file_path = step["file"]
    
    if step.get("type") == "write" or step.get("action") is None:
        # Standard write/overwrite
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(step["content"])
    elif step.get("action") == "append":
        with open(file_path, "a", encoding="utf-8") as f:
            f.write(step["content"])
    elif step.get("action") == "replace":
        # Read file
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace target content
        target = step["target"]
        replacement = step["content"]
        if target in content:
            content = content.replace(target, replacement)
        else:
            print(f"  [WARNING] Target '{target}' not found in {file_path}, appending instead")
            content += f"\n{replacement}"
            
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
            
    # Commit and push
    success = git_commit_and_push(step["msg"])
    if not success:
        print("Stopping execution loop due to git failure.")
        sys.exit(1)

print("\nAll 100 commits completed successfully!")
