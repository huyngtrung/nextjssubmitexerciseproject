import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

export function getExerciseGlobalTag() {
    return getGlobalTag('exercises');
}

export function getExerciseIdTag(id: string) {
    return getIdTag('exercises', id);
}

export function revalidateExerciseCache(id: string) {
    revalidateTag(getExerciseGlobalTag());
    revalidateTag(getExerciseIdTag(id));
}
