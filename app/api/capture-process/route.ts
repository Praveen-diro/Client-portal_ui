import { NextRequest, NextResponse } from "next/server";

export interface CaptureProcessRequestBody {
  buttonid: string;
  orgid: string;
  apikey: string;
  trackingid?: string;
}

export interface ErrorResponse {
  message: string;
  code?: string;
}

/**
 * Handle POST requests to generate verification links
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json() as CaptureProcessRequestBody;
    const { buttonid, orgid, apikey, trackingid } = body;

    // Validate required fields
    if (!buttonid) {
      return NextResponse.json(
        { message: "Button ID cannot be null or empty", code: "MISSING_BUTTON_ID" } as ErrorResponse,
        { status: 400 }
      );
    }

    if (!orgid) {
      return NextResponse.json(
        { message: "Organization ID cannot be null or empty", code: "MISSING_ORG_ID" } as ErrorResponse,
        { status: 400 }
      );
    }

    if (!apikey) {
      return NextResponse.json(
        { message: "API key cannot be null or empty", code: "MISSING_API_KEY" } as ErrorResponse,
        { status: 400 }
      );
    }

    // Prepare the request payload
    const payload = {
      buttonid,
      orgid,
      apikey,
      ...(trackingid && { trackingid }),
    };

    console.log(`Generating verification link for button: ${buttonid}, org: ${orgid}`);

    // Make the request to the external API
    const response = await fetch("https://api.dirolabs.com/get-verification-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Get the response data
    const data = await response.json();

    if (!response.ok) {
      console.error(`Error response from API: ${response.status}`, data);
    } else {
      console.log(`Successfully generated verification link for session: ${data.sessionid}`);
    }

    // Return the response with the appropriate status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error processing capture process request:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request", code: "INTERNAL_ERROR" } as ErrorResponse,
      { status: 500 }
    );
  }
} 