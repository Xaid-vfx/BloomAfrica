import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import PaymentComponent from '../Payment/Payment';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { MapPin, Eye, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface Column {
    id: 'title' | 'location' | 'date' | 'action';
    label: string;
    minWidth?: number;
    align?: 'right' | 'center';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'title', label: 'TITLE', minWidth: 170 },
    { id: 'location', label: 'LOCATION', minWidth: 100 },
    {
        id: 'date',
        label: 'APPLIED ON',
        minWidth: 170,
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'action',
        label: 'ACTION',
        minWidth: 180,
        align: 'center',
        format: (value: number) => value.toLocaleString('en-US'),
    },
];

interface Data {
    id: number;
    uid: string;
    title: string;
    location: string;
    date: string;
    action: string;
    signup_fee: number;
    job_limit: number;
    confirmed_count: number;
}

function createData(
    id: number,
    uid: string,
    title: string,
    location: string,
    date: string,
    action: string,
    signup_fee: number,
    job_limit: number,
    confirmed_count: number
): Data {
    return { id, uid, title, location, date, action, signup_fee, job_limit, confirmed_count };
}

interface PaymentStatusProps {
    row: Data;
    seekerId: string;
    paymentStatuses: { [key: string]: string };
    setPaymentStatuses: (value: { [key: string]: string }) => void;
    setJobCapacityStatus: (value: { [key: string]: boolean }) => void;
    checkJobCapacity: (jobId: string) => Promise<boolean>;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
    row,
    seekerId,
    paymentStatuses,
    setPaymentStatuses,
    setJobCapacityStatus,
    checkJobCapacity
}) => {
    const [status, setStatus] = useState<React.ReactNode | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            setIsLoading(true);

            // First check if this application is already paid for
            const isPaid = paymentStatuses[row.id] === 'success';

            // If paid, we don't care about capacity - the spot is secured
            if (isPaid) {
                setStatus(
                    <div className="flex items-center justify-center gap-2 bg-green-50 border-2 border-green-200 text-green-700 px-3 py-2 rounded-xl text-sm font-medium">
                        <CheckCircle size={16} />
                        Payment Successful
                    </div>
                );
                setIsLoading(false);
                return;
            }

            // Only check capacity if not paid
            const isAtCapacity = await checkJobCapacity(row.uid);

            if (isAtCapacity) {
                setStatus(
                    <div className="flex items-center justify-center gap-2 bg-yellow-50 border-2 border-yellow-200 text-yellow-700 px-3 py-2 rounded-xl text-sm font-medium">
                        <AlertCircle size={16} />
                        No Spots Available
                    </div>
                );
            } else if (row.signup_fee > 0) {
                setStatus(
                    <div className='flex flex-col gap-2'>
                        <PaymentComponent
                            jobId={row.uid}
                            seekerId={seekerId}
                            amount={row.signup_fee}
                            initialPaymentStatus={paymentStatuses[row.id]}
                            onPaymentSuccess={async () => {
                                setPaymentStatuses((prev: { [key: string]: string }) => {
                                    const newState: { [key: string]: string } = {
                                        ...prev,
                                        [row.id]: 'success'
                                    };
                                    return newState;
                                });
                                const newCapacityStatus = await checkJobCapacity(row.uid);
                                setJobCapacityStatus((prev: { [key: string]: boolean }) => {
                                    const newState: { [key: string]: boolean } = {
                                        ...prev,
                                        [row.id]: newCapacityStatus
                                    };
                                    return newState;
                                });
                            }}
                        />
                        <p className='text-xs text-center text-red-600 font-medium bg-red-50 px-2 py-1.5 rounded-lg'>
                            Complete payment to get started
                        </p>
                    </div>
                );
            }
            setIsLoading(false);
        };

        checkStatus();
    }, [row.id, row.uid, paymentStatuses, checkJobCapacity, seekerId, row.signup_fee]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-2 text-gray-600 px-3 py-2 text-sm">
                <Clock size={16} className="animate-pulse" />
                Checking...
            </div>
        );
    }

    return status;
};

export default function AppliedTable(props: any) {
    const [paymentStatuses, setPaymentStatuses] = useState<{ [key: string]: string }>({});
    const [jobCapacityStatus, setJobCapacityStatus] = useState<{ [key: string]: boolean }>({});
    const supabase = createClientComponentClient();

    const checkJobCapacity = async (jobId: string) => {
        const { data, error } = await supabase
            .from('job_applications_count')
            .select('confirmed_count')
            .eq('job_id', jobId)
            .single();

        if (error) {
            console.error('Error checking job capacity:', error);
            return false;
        }

        const job = props.jobs.find((j: any) => j.uid === jobId);
        return (data?.confirmed_count || 0) >= (job?.limit || 0);
    };

    useEffect(() => {
        // Initialize payment statuses from the server-side data
        const statuses = props.jobs.reduce((acc: any, job: any) => ({
            ...acc,
            [job.id]: job.paymentStatus
        }), {});
        setPaymentStatuses(statuses);

        // Initialize capacity status for each job
        const initializeCapacityStatus = async () => {
            const capacityStatus = {};
            for (const job of props.jobs) {
                capacityStatus[job.id] = await checkJobCapacity(job.uid);
            }
            setJobCapacityStatus(capacityStatus);
        };

        initializeCapacityStatus();
    }, [props.jobs]);

    const rows = [...props.jobs.map((job: any) => {
        return createData(
            job.id,
            job.uid,
            job.title,
            job.location,
            job.created_at.substring(0, job.created_at.indexOf('T')),
            "...",
            job.signup_fee,
            job.limit,
            job.confirmed_count || 0
        );
    })];

    rows.sort((a, b) => b.id - a.id);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: "none", borderRadius: '16px' }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="applied apprenticeships table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                        sx={{
                                            color: '#6B7280',
                                            fontWeight: '600',
                                            fontSize: '13px',
                                            letterSpacing: '0.5px',
                                            backgroundColor: '#F9FAFB',
                                            borderBottom: '2px solid #E5E7EB',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {column.id === "title" ? <div className='pl-6'>{column.label}</div> : column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#F0FDFA !important'
                                                },
                                                borderBottom: '1px solid #F3F4F6'
                                            }}
                                        >
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        sx={{ borderBottom: '1px solid #F3F4F6' }}
                                                    >
                                                        {column.id === 'title' && (
                                                            <div className='flex flex-col gap-2 py-3 pl-6'>
                                                                <h2 className='font-semibold text-[#0A1F44] text-lg'>{value}</h2>
                                                                <p className='flex gap-1.5 items-center text-sm text-gray-600'>
                                                                    <MapPin size={14} className="text-[#14B8A6]" />
                                                                    {row.location}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {column.id === 'location' && (
                                                            <div className='text-base text-gray-700 font-medium'>{value}</div>
                                                        )}

                                                        {column.id === 'date' && (
                                                            <div className='text-sm text-gray-600'>{value}</div>
                                                        )}

                                                        {column.id === 'action' && (
                                                            <div className='flex flex-col gap-3 justify-center py-3'>
                                                                <a
                                                                    href={`/all-trainings/job?id=${row.uid}`}
                                                                    className='inline-flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-4 py-2.5 font-semibold rounded-xl transition-colors shadow-md shadow-[#14B8A6]/20'
                                                                >
                                                                    <Eye size={16} />
                                                                    View Application
                                                                </a>
                                                                <PaymentStatus
                                                                    row={row}
                                                                    seekerId={props.seekerId}
                                                                    paymentStatuses={paymentStatuses}
                                                                    setPaymentStatuses={setPaymentStatuses}
                                                                    setJobCapacityStatus={setJobCapacityStatus}
                                                                    checkJobCapacity={checkJobCapacity}
                                                                />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: '2px solid #E5E7EB',
                        backgroundColor: '#F9FAFB',
                        '.MuiTablePagination-select': {
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            padding: '4px 8px',
                        },
                        '.MuiTablePagination-actions button': {
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: '#F0FDFA'
                            }
                        }
                    }}
                />
            </Paper>
        </div>
    );
}
