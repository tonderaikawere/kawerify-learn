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
};