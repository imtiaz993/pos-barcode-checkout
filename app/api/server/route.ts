import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let identifier;
    let messages;
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`File - ${key}:`, value);
        } else {
          console.log(`Message - ${key}:`, value);
        }
      });
    } else {
      const messageRequestBody = await req.json();
      messages = messageRequestBody.messages;
      //Identifier means Chats or Tasks
      identifier = messageRequestBody.identifier;
    }
    return identifier === "chats"
      ? NextResponse.json({
          html: `
    <div style="padding: 10px; background: #fff; border-radius: 8px;">
        <div style="border-left: 3px solid #007bff; padding-left: 10px; color: #555; font-style: italic; margin-bottom: 5px;">
            ${
              messages[0].text.length > 100
                ? messages[0].text.slice(0, 100) + "..."
                : messages[0].text
            }
        </div>
        <div>
            Thankyou for sending the message.
        </div>
    </div>

`,
        })
      : NextResponse.json({
          html: `    <div style=" margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Task Title</h2>

        <h3 style="color: #555;">Step by Step Breakdown</h3>
        <ul style="text-align: left; padding-left: 20px; color: #666;">
            <li><strong>Step 1:</strong> Understand the task requirements and objectives.</li>
            <li><strong>Step 2:</strong> Gather necessary resources, tools, or information.</li>
            <li><strong>Step 3:</strong> Plan the structure or workflow for execution.</li>
            <li><strong>Step 4:</strong> Execute the task with clarity and logical steps.</li>
            <li><strong>Step 5:</strong> Review and refine for accuracy and improvements.</li>
            <li><strong>Step 6:</strong> Finalize and ensure readiness for delivery.</li>
            <li><strong>Step 7:</strong> Submit or implement the task within the required timeline.</li>
        </ul>

        <h3 style="color: #555;">Estimated Bid:  <span>$250</span></h3>
        <h3 style="color: #555;">Information Needed from You</h3>
        <ul style="text-align: left; padding-left: 20px; color: #666;">
            <li>📌 What is the main objective of the task?</li>
            <li>📌 What are the key steps or components required?</li>
            <li>📌 Are there specific guidelines, standards, or constraints to follow?</li>
            <li>📌 Do you need any resources, tools, or references?</li>
            <li>📌 Is any specific software or platform required?</li>
            <li>📌 Do you have any existing notes, data, or research to build upon?</li>
            <li>📌 Who is the target audience or end user of the task?</li>
        </ul>

        <br>

        <button id="takePayment" 
                style="background-color: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
            Start Task - Pay Now
        </button>
    </div>`,
        });
  } catch (error) {
    console.log("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
