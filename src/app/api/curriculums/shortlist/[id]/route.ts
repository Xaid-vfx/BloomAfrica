import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface RouteParams {
    params: {
        id: string;
    };
}

/**
 * DELETE /api/curriculums/shortlist/[id]
 * Remove a curriculum from trainer's shortlist
 */
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const shortlistId = params.id;

        if (!shortlistId) {
            return NextResponse.json({ error: 'Shortlist ID is required' }, { status: 400 });
        }

        // Verify the shortlist entry belongs to the user
        const { data: shortlistEntry, error: fetchError } = await supabase
            .from('TrainerCurriculums')
            .select('id, user_id')
            .eq('id', shortlistId)
            .single();

        if (fetchError || !shortlistEntry) {
            return NextResponse.json({ error: 'Shortlist entry not found' }, { status: 404 });
        }

        if (shortlistEntry.user_id !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Soft delete by setting is_active to false
        const { error: deleteError } = await supabase
            .from('TrainerCurriculums')
            .update({ is_active: false })
            .eq('id', shortlistId);

        if (deleteError) {
            console.error('Error removing from shortlist:', deleteError);
            return NextResponse.json(
                { error: 'Failed to remove from shortlist' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Curriculum removed from shortlist',
        });
    } catch (error) {
        console.error('Error in shortlist DELETE route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
