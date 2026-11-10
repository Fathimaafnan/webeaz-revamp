export function successJson(data: Record<string, unknown>, status = 200): Response {
  return Response.json({ ok: true, data }, { status });
}

export function errorJson(message: string, status: number): Response {
  return Response.json({ ok: false, error: message }, { status });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function readJsonRecord(
  request: Request,
): Promise<
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; response: Response }
> {
  try {
    const value: unknown = await request.json();
    if (!isRecord(value)) {
      return {
        ok: false,
        response: errorJson("Request body must be a JSON object.", 400),
      };
    }
    return { ok: true, value };
  } catch {
    return {
      ok: false,
      response: errorJson("Request body must contain valid JSON.", 400),
    };
  }
}

export function hasOnlyKeys(
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  const allowed = new Set(keys);
  return Object.keys(value).every((key) => allowed.has(key));
}

export function isPrismaUniqueError(error: unknown): boolean {
  return isRecord(error) && error.code === "P2002";
}

export function isPrismaTransactionConflict(error: unknown): boolean {
  return isRecord(error) && error.code === "P2034";
}
