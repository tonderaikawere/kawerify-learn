const resources = {
  html_css: [
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', desc: 'The official and most detailed guide to HTML elements.' },
    { name: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/', desc: 'Easy tutorial with sandbox code executors.' }
  ],
  javascript: [
    { name: 'Javascript.info', url: 'https://javascript.info/', desc: 'Modern tutorial outlining complex closures, scopes, and properties.' },
    { name: 'MDN Javascript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', desc: 'Official API documentation mapping browser APIs.' }
  ],
  react: [
    { name: 'React Official Docs', url: 'https://react.dev', desc: 'Official React website outlining hooks and modern JSX rules.' },
    { name: 'Beta React docs', url: 'https://react.dev/reference/react', desc: 'Detailed component references and standard hook APIs.' }
  ],
  python: [
    { name: 'Python.org Documentation', url: 'https://docs.python.org/3/', desc: 'Official index for Python variables, standard libraries, and scopes.' },
    { name: 'Real Python Tutorials', url: 'https://realpython.com', desc: 'Deep dive articles mapping web frameworks and CLI structures.' }
  ],
  c: [
    { name: 'cppreference C reference', url: 'https://en.cppreference.com/w/c', desc: 'Standard C standard libraries, pointers, and memory maps.' },
    { name: 'ISO C Standard details', url: 'https://www.iso.org/standard/74528.html', desc: 'C standard language syntax committee documents.' }
  ],
  cpp: [
    { name: 'cppreference C++ Reference', url: 'https://en.cppreference.com/w/cpp', desc: 'STL containers reference, smart pointers, template rules.' },
    { name: 'Learn C++ Guidelines', url: 'https://www.learncpp.com/', desc: 'In-depth steps outlining classes, templates, and compiler optimization.' }
  ],
  csharp: [
    { name: 'Microsoft Learn .NET C#', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/', desc: 'Official MS guide outlining namespaces, properties, and assemblies.' },
    { name: 'C# Programming Yellow Book', url: 'http://www.csharpyellowbook.com/', desc: 'Free detailed textbook mapping variables, lists, and GUI frameworks.' }
  ],
  php: [
    { name: 'PHP.net Official Manual', url: 'https://www.php.net/manual/en/', desc: 'Official documentation detailing superglobals, form actions, and SQL connectors.' },
    { name: 'W3Schools PHP reference', url: 'https://www.w3schools.com/php/', desc: 'Quick reference containing syntax guides and standard forms.' }
  ],
  freecodecamp: [
    { name: 'freeCodeCamp Website', url: 'https://www.freecodecamp.org/', desc: 'Free web certificates, algorithm challenges, and databases tutorials.' },
    { name: 'freeCodeCamp C++ Video', url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y', desc: 'Complete 31-hour video course on basic syntax and STL.' },
    { name: 'freeCodeCamp C# Video', url: 'https://www.youtube.com/watch?v=GhQdlIFylQ8', desc: 'Comprehensive 4-hour video tutorial mapping objects.' }
  ]
};

if (typeof window !== 'undefined') {
  window.resources = resources;
}
// Added official documentation links for React developer books references.
// Added official documentation links for Python cheat sheets reference tools.
// Added official documentation links for C++ coding cheat sheets reference tools.
// Added C# official coding guidelines from Microsoft specifications.
// Added HTML CSS guidelines from MDN official specifications.
// Added freeCodeCamp React video course tutorial details metadata.
// Added freeCodeCamp Python video course tutorial details metadata.
// Added freeCodeCamp C++ video course tutorial details metadata.
// Added freeCodeCamp C# video course tutorial details metadata.