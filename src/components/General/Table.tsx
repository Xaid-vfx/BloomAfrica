import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Image from 'next/image';
import User from '../../assets/images/user.jpg'
import { DialogDemo } from '../Modal/Modal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PiCaretUpDownFill } from "react-icons/pi";
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


interface Column {
    id: 'name' | 'status' | 'date' | 'action' | 'paymentStatus';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    {
        id: 'name',
        label: 'CANDIDATES',
        minWidth: 170
    },
    {
        id: 'status',
        label: 'ACCEPT/REJECT',
        minWidth: 100
    },
    {
        id: 'paymentStatus',
        label: 'PAYMENT STATUS',
        minWidth: 100
    },
    {
        id: 'date',
        label: 'APPLIED DATE',
        minWidth: 170,
    },
    {
        id: 'action',
        label: 'ACTION',
        minWidth: 130,
        align: 'center',
    },
];

interface Data {
    id: number,
    name: string;
    status: string;
    paymentStatus?: string;
    date: string;
    action: string;
    uid: string
}

function createData(
    id: number,
    name: string,
    status: string,
    date: string,
    action: string,
    uid: string,
    paymentStatus?: string
): Data {

    return { id, name, status, date, action, uid, paymentStatus };
}

// const rows = [
//     createData('India', 'IN', 1324171354, 3287263),
//     createData('China', 'CN', 1403500365, 9596961),
//     createData('Italy', 'IT', 60483973, 301340),
//     createData('United States', 'US', 327167434, 9833520),
//     createData('Canada', 'CA', 37602103, 9984670),
//     createData('Australia', 'AU', 25475400, 7692024),
//     createData('Germany', 'DE', 83019200, 357578),
//     createData('Ireland', 'IE', 4857000, 70273),
//     createData('Mexico', 'MX', 126577691, 1972550),
//     createData('Japan', 'JP', 126317000, 377973),
//     createData('France', 'FR', 67022000, 640679),
//     createData('United Kingdom', 'GB', 67545757, 242495),
//     createData('Russia', 'RU', 146793744, 17098246),
//     createData('Nigeria', 'NG', 200962417, 923768),
//     createData('Brazil', 'BR', 210147125, 8515767),
// ];

export default function StickyHeadTable(props: any) {
    console.log(props.applications);

    const [paymentStatuses, setPaymentStatuses] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     const fetchPaymentStatuses = async () => {
    //         setIsLoading(true);
    //         const supabase = createClientComponentClient();
    //         const { data, error } = await supabase
    //             .from('jobpayments')
    //             .select('job_id, status')
    //             .eq('seeker_id', props.user.id);

    //         if (data) {
    //             const statuses = data.reduce((acc, curr) => ({
    //                 ...acc,
    //                 [curr.job_id]: curr.status
    //             }), {});
    //             setPaymentStatuses(statuses);
    //         }
    //         setIsLoading(false);
    //     };

    //     fetchPaymentStatuses();
    // }, [props.user.id]);

    const rows = [...props.applications.map((app: any) => {
        return createData(app.unique_id, app.name, app.status, app.created_at.substring(0, app.created_at.indexOf('T')), "View", app.seeker_id, app.payment_status);
    })];

    rows.sort((a, b) => b.id - a.id);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(2);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{
            width: '100%',
            overflow: 'hidden',
            boxShadow: 'none',
            borderRadius: '16px',
            border: '1px solid #E5E7EB'
        }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="applications table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
                                        backgroundColor: '#F8F9FA',
                                        color: '#4A5568',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        borderBottom: '2px solid #E5E7EB',
                                        padding: '16px 24px',
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.code}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#F8F9FA',
                                                transition: 'all 0.2s',
                                            },
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    sx={{
                                                        borderBottom: '1px solid #E5E7EB',
                                                        padding: '16px 24px',
                                                    }}
                                                >
                                                    
                                                    {column.id === 'name' ? (
                                                        <div className='flex items-center gap-4 pr-10 pl-2'>
                                                            
                                                            <div>
                                                                <h2 className='font-medium text-gray-900 text-base'>{value}</h2>
                                                            </div>
                                                        </div>
                                                    ) : ""}

                                                    {column.id === 'date' ? (
                                                        <div className='text-sm text-gray-600'>{value}</div>
                                                    ) : ""}

                                                    {column.id === 'status' ? (
                                                        <div className='text-base'>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger className='px-4 py-2 text-gray-600 border border-gray-200 text-sm gap-2 rounded-xl flex items-center hover:bg-gray-50 transition-colors'>
                                                                    Update Status
                                                                    <PiCaretUpDownFill className="text-base" />
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                                    <DropdownMenuItem
                                                                        onClick={() => { props.updateStatus('accepted', row.id) }}
                                                                        className='py-2 cursor-pointer hover:bg-green-50 hover:text-green-600'
                                                                    >
                                                                        Accept
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => { props.updateStatus('rejected', row.id) }}
                                                                        className='py-2 cursor-pointer hover:bg-red-50 hover:text-red-600'
                                                                    >
                                                                        Reject
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    ) : ""}

                                                    {column.id === 'paymentStatus' ? (
                                                        <div className={`text-center px-4 py-2 rounded-xl text-sm font-medium ${value === 'success'
                                                            ? 'bg-green-50 text-green-600'
                                                            : 'bg-red-50 text-red-600'
                                                            }`}>
                                                            {value === 'success' ? 'Paid' : 'Unpaid'}
                                                        </div>
                                                    ) : ""}

                                                    {column.id === 'action' ? (
                                                        <div className='flex flex-col gap-2 justify-center items-center'>
                                                            <button
                                                                onClick={() => {
                                                                    props.fetchApplicantDetails(row.uid)
                                                                }}
                                                                className='bg-[#E9EBFD] text-[#4A2C84] px-6 py-2 font-medium text-sm rounded-xl cursor-pointer text-center w-full hover:bg-[#4A2C84] hover:text-white transition-colors'
                                                            >
                                                                View Application
                                                            </button>
                                                            <div className="w-full">
                                                                <DialogDemo
                                                                    seeker_id={row.uid}
                                                                    name={row.name}
                                                                    user_id={props.user.id}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : ""}
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
                    borderTop: '1px solid #E5E7EB',
                    '.MuiTablePagination-select': {
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        padding: '4px 8px',
                    }
                }}
            />
        </Paper>
    );
}