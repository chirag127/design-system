/** OpenAI-shape chat message. */
export interface Message {
	role: 'system' | 'user' | 'assistant'
	content: string | ContentPart[]
}

export type ContentPart =
	| { type: 'text'; text: string }
	| { type: 'image_url'; image_url: { url: string } }

export interface ChatOptions {
	/** Pollinations model id. Default 'openai'. */
	model?: string
	/** Abort the request. */
	signal?: AbortSignal
	/** Sampling temperature. */
	temperature?: number
}

export interface RequestPayload {
	model: string
	messages: Message[]
	temperature?: number
}

/** Build the OpenAI-shape request body. Pure — no I/O. */
export function buildPayload(
	messages: Message[],
	options: ChatOptions = {},
): RequestPayload {
	const payload: RequestPayload = {
		model: options.model ?? 'openai',
		messages,
	}
	if (options.temperature !== undefined)
		payload.temperature = options.temperature
	return payload
}

/** Build a vision message from a prompt + image data URL (or http url). Pure. */
export function buildVisionMessages(
	prompt: string,
	imageDataUrl: string,
): Message[] {
	return [
		{
			role: 'user',
			content: [
				{ type: 'text', text: prompt },
				{ type: 'image_url', image_url: { url: imageDataUrl } },
			],
		},
	]
}
