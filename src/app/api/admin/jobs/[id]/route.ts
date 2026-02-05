import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET - Fetch a single job by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        const { data: job, error } = await supabase
            .from('Jobs')
            .select('*')
            .eq('uid', params.id)
            .single();

        if (error) {
            console.error('Error fetching job:', error);
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({ job });
    } catch (error) {
        console.error('Error in get job route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update a job
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const updates = await request.json();

        // Remove fields that shouldn't be updated directly
        delete updates.uid;
        delete updates.id;
        delete updates.created_at;
        delete updates.recruiter;

        const { data: job, error } = await supabase
            .from('Jobs')
            .update(updates)
            .eq('uid', params.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating job:', error);
            return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
        }

        return NextResponse.json({ job, message: 'Job updated successfully' });
    } catch (error) {
        console.error('Error in update job route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete a job
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        const { error } = await supabase
            .from('Jobs')
            .delete()
            .eq('uid', params.id);

        if (error) {
            console.error('Error deleting job:', error);
            return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error in delete job route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
