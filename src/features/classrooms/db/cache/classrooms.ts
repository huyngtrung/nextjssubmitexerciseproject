import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

export function getClassroomGlobalTag() {
    return getGlobalTag('classrooms');
}

export function getClassroomIdTag(id: string) {
    return getIdTag('classrooms', id);
}

export function revalidateClassroomCache(id: string) {
    revalidateTag(getClassroomGlobalTag());
    revalidateTag(getClassroomIdTag(id));
}
