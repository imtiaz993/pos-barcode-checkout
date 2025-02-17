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

export const data = [
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
