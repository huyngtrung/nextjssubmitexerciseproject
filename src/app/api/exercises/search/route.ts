// app/api/classrooms/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { typesenseClient } from '@/lib/typesense';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';

interface ExerciseDocument {
    id: string;
    name: string;
    name_normalized: string;
    description?: string;
    order?: number;
}

function normalizeString(str: string) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') ?? '';

    if (!q) {
        return NextResponse.json(
            { error: true, message: 'Missing query parameter' },
            { status: 400 },
        );
    }

    const normalizedQuery = normalizeString(q);

    try {
        const searchResults: SearchResponse<ExerciseDocument> = await typesenseClient
            .collections<ExerciseDocument>('exercises')
            .documents()
            .search({
                q: normalizedQuery,
                query_by: 'name_normalized',
                prefix: true,
                num_typos: 1,
                per_page: 10,
            });

        const data = (searchResults.hits ?? []).map((hit) => hit.document);

        return NextResponse.json({ error: false, data });
    } catch (err) {
        console.error('Typesense search error:', err);
        return NextResponse.json({ error: true, message: 'Search failed' }, { status: 500 });
    }
}
