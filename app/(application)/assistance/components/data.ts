// Example Data
// [
//   {
//     role: "user",
//     files: [
//       { src: "path-to-file.jpeg", type: "image" },
//       { src: "data:image/gif;base64,R0lGODlh4A...", type: "image" },
//       { src: "path-to-file.wav", type: "audio" },
//       { name: "placeholder.exe" },
//       { src: "path-to-file", name: "hello-world.txt", type: "file" },
//     ],
//   },
// {
//   html: `
//     <div>
//       <div style="margin-bottom: 10px">Here is a simple example:</div>
//       <active-table
//         data='[["Planet", "Mass"], ["Earth", 5.97], ["Mars", 0.642], ["Jupiter", 1898]]'
//         cellStyle='{"width": "80px"}'
//         displayAddNewRow="false"
//         displayAddNewColumn="false">
//       </active-table>
//     </div>`,
//   role: 'ai',
// },
// ];

export const chatData = [
  {
    id: 1,
    chats: [
      { text: "Show me a modern city", role: "user" },
      {
        files: [
          {
            src: "https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1200",
            type: "image",
          },
        ],
        role: "ai",
      },
      { text: "Whats on your mind?", role: "user" },
      { text: "Peace and tranquility", role: "ai" },
    ],
  },
  {
    id: 2,
    chats: [
      { role: "user", text: "Hey, how are you today?" },
      { role: "ai", text: "I am doing very well! How about you?" },
      { role: "user", text: "I'm doing great, thanks for asking." },
      {
        role: "ai",
        text: "Glad to hear that! What can I help you with today?",
      },
    ],
  },
  {
    id: 3,
    chats: [
      { role: "user", text: "What's the weather like today?" },
      { role: "ai", text: "It's sunny with a high of 25°C." },
      { role: "user", text: "Great! Should I take an umbrella?" },
      { role: "ai", text: "No need! It’s going to stay clear all day." },
    ],
  },
  {
    id: 4,
    chats: [
      { role: "user", text: "Can you tell me a joke?" },
      { role: "ai", text: "Sure! Why don't skeletons fight each other?" },
      { role: "user", text: "I don't know, why?" },
      { role: "ai", text: "Because they don't have the guts!" },
    ],
  },
  {
    id: 5,
    chats: [
      { role: "user", text: "Help me with a math problem." },
      { role: "ai", text: "Of course! What’s the problem?" },
      { role: "user", text: "What is 12 times 9?" },
      { role: "ai", text: "12 times 9 is 108." },
    ],
  },
  {
    id: 6,
    chats: [
      { role: "user", text: "Can you recommend a movie?" },
      {
        role: "ai",
        text: "Sure! How about 'Inception'? It's a great sci-fi thriller.",
      },
      { role: "user", text: "Sounds good! What’s it about?" },
      {
        role: "ai",
        text: "It's about a thief who enters people's dreams to steal secrets from their subconscious.",
      },
    ],
  },
];

export const taskData = [
  {
    id: 1,
    paymentStatus: true,
    chats: [
      {
        text: "I need to complete a project report by tomorrow.",
        role: "user",
      },
      {
        html: `    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Project Report Completion</h2>

        <h3 style="color: #555;">Step by Step Breakdown</h3>
        <ul style="text-align: left; padding-left: 20px; color: #666;">
            <li><strong>Step 1:</strong> Understand the report requirements.</li>
            <li><strong>Step 2:</strong> Gather data & research necessary information.</li>
            <li><strong>Step 3:</strong> Outline the report structure (Introduction, Findings, etc.).</li>
            <li><strong>Step 4:</strong> Draft the content with clarity and logical flow.</li>
            <li><strong>Step 5:</strong> Proofread & edit for errors and coherence.</li>
            <li><strong>Step 6:</strong> Format & finalize for submission.</li>
            <li><strong>Step 7:</strong> Submit the report before the deadline.</li>
        </ul>

        <h3 style="color: #555;">Estimated Bid:  <span>$200</span></h3>
        <h3 style="color: #555;">Information Needed from You</h3>
        <ul style="text-align: left; padding-left: 20px; color: #666;">
            <li>📌 What is the topic of the report?</li>
            <li>📌 What are the key sections required (Introduction, Findings, etc.)?</li>
            <li>📌 Are there specific formatting requirements (word limit, font, citations)?</li>
            <li>📌 Do you need data sources or references?</li>
            <li>📌 Is any specific software/tool required for submission (Word, PDF, LaTeX)?</li>
            <li>📌 Do you have any existing notes or research material?</li>
            <li>📌 Who is the audience for the report (client, professor, company)?</li>
        </ul>

        <br>

        <button id="takePayment120" 
                style="background-color: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
            Start Task - Pay Now
        </button>
    </div>`,
        role: "ai",
      },
    ],
  },
  {
    id: 2,
    paymentStatus: false,
    chats: [
      {
        text: "I Need a website design.",
        role: "user",
      },
      {
        html: `<div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Website Design</h2>

        <h3 style="color: #555;">Step by Step Breakdown</h3>
        <ul style="text-align: left; padding-left: 20px; color: #666;">
            <li><strong>Step 1:</strong> Understand the website’s purpose and goals.</li>
            <li><strong>Step 2:</strong> Plan the website structure (Homepage, About, Contact, etc.).</li>
            <li><strong>Step 3:</strong> Create wireframes or mockups for layout design.</li>
            <li><strong>Step 4:</strong> Implement **HTML & inline CSS** for styling.</li>
            <li><strong>Step 5:</strong> Ensure **responsiveness** across all devices.</li>
            <li><strong>Step 6:</strong> Add **buttons, animations, and interactive elements**.</li>
            <li><strong>Step 7:</strong> Optimize **loading speed and performance**.</li>
            <li><strong>Step 8:</strong> Test and finalize for **deployment**.</li>
        </ul>

        <h3 style="color: #555;">Estimated Bid: <span>$400</span></h3>
        
        <h3 style="color: #555;">Information Needed from You</h3>
        <ul style="text-align: left; padding-left: 20px; color: #666;">
            <li>📌 What type of website is needed? (Business, Portfolio, SaaS, etc.)</li>
            <li>📌 How many pages should be designed? (Home, Services, About, etc.)</li>
            <li>📌 Do you have a **color scheme, logo, or branding preferences**?</li>
            <li>📌 Should I use specific fonts or design elements?</li>
            <li>📌 Will you provide content (text & images), or should I use placeholders?</li>
            <li>📌 Do you need animations or interactive elements?</li>
            <li>📌 Should there be a **contact form, signup, or other forms**?</li>
            <li>📌 Are there **any reference websites** you like?</li>
        </ul>

        <br>

        <button id="takePayment" 
                style="background-color: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
            Start Task - Pay Now
        </button>
</div>
`,
        role: "ai",
      },
    ],
  },
  {
    id: 3,
    paymentStatus: false,
    chats: [
      { text: "Plan a team outing for next weekend.", role: "user" },
      {
        html: `<div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Team Outing Plan</h2>

        <h3 style="color: #555;">Step by Step Breakdown</h3>
        <ul style="text-align: left; padding-left: 20px; color: #666;">
            <li><strong>Step 1:</strong> Choose a date and time for the outing.</li>
            <li><strong>Step 2:</strong> Decide on a **destination or activity** (adventure, dinner, retreat, etc.).</li>
            <li><strong>Step 3:</strong> Confirm the **number of attendees**.</li>
            <li><strong>Step 4:</strong> Arrange **transportation** (carpool, bus, etc.).</li>
            <li><strong>Step 5:</strong> Plan the **food and refreshments**.</li>
            <li><strong>Step 6:</strong> Create an **itinerary with activities and free time**.</li>
            <li><strong>Step 7:</strong> Set a **budget per person** and confirm payments.</li>
            <li><strong>Step 8:</strong> Send **final details and reminders** to the team.</li>
        </ul>

        <h3 style="color: #555;">Estimated Budget: <span>$500</span></h3>

        <h3 style="color: #555;">Information Needed from You</h3>
        <ul style="text-align: left; padding-left: 20px; color: #666;">
            <li>📌 What type of outing do you prefer? (Adventure, Dinner, Beach, etc.)</li>
            <li>📌 How many team members are expected to join?</li>
            <li>📌 Do you have a preferred location?</li>
            <li>📌 Should we arrange transport or will everyone manage on their own?</li>
            <li>📌 What is the budget per person?</li>
            <li>📌 Are there any dietary preferences or restrictions?</li>
            <li>📌 Do you want team-building activities included?</li>
        </ul>

        <br>

        <button id="takePayment" 
                style="background-color: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
            Start Task - Pay Now
        </button>
</div>
`,
        role: "ai",
      },
    ],
  },
  {
    id: 4,
    paymentStatus: false,
    chats: [
      { text: "Create a shopping list, please.", role: "user" },
      {
        html: `<div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Shopping List</h2>

        <h3 style="color: #555;">Step by Step Breakdown</h3>
        <ul style="text-align: left; padding-left: 20px; color: #666;">
            <li><strong>Step 1:</strong> Identify the **items needed** (groceries, clothes, electronics, etc.).</li>
            <li><strong>Step 2:</strong> Set a **budget range**.</li>
            <li><strong>Step 3:</strong> Choose **stores or online platforms** for shopping.</li>
            <li><strong>Step 4:</strong> Prioritize essential items first.</li>
            <li><strong>Step 5:</strong> Check for discounts, deals, or coupons.</li>
            <li><strong>Step 6:</strong> Make a final review before purchase.</li>
            <li><strong>Step 7:</strong> Purchase and track expenses.</li>
        </ul>

        <h3 style="color: #555;">Estimated Budget: <span>$100</span></h3>

        <h3 style="color: #555;">Information Needed from You</h3>
        <ul style="text-align: left; padding-left: 20px; color: #666;">
            <li>📌 What items do you need to buy?</li>
            <li>📌 What is your budget for shopping?</li>
            <li>📌 Do you prefer online shopping or in-store?</li>
            <li>📌 Are there any specific brands or preferences?</li>
            <li>📌 Do you need any urgent items?</li>
            <li>📌 Are there any dietary or product restrictions?</li>
        </ul>

        <br>

        <button id="takePayment" 
                style="background-color: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
            Start Task - Pay Now
        </button>
</div>
`,
        role: "ai",
      },
      ,
    ],
  },
];
