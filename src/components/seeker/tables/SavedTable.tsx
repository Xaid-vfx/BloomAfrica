import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { MapPin, Eye, Trash2 } from "lucide-react";

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
        label: 'CREATED ON',
        minWidth: 170,
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'action',
        label: 'ACTION',
        minWidth: 100,
        align: 'center',
        format: (value: number) => value.toLocaleString('en-US'),
    },
];

interface Data {
    id: number,
    title: string;
    location: string;
    date: string;
    action: string;
    uid: string
}

function createData(
    id: number,
    title: string,
    location: string,
    date: string,
    action: string,
    uid: string
): Data {

    return { id, title, location, date, action, uid };
}

export default function SavedTable(props: any) {
    console.log(props.jobs);

    const rows = [...props.jobs.map((job: any) => {
        return createData(job.id, job.title, job.location, job.created_at.substring(0, job.created_at.indexOf('T')), "...", job.uid);
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
                    <Table stickyHeader aria-label="saved apprenticeships table">
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
                                                        {column.id === 'title' ? (
                                                            <div className='flex flex-col gap-2 py-3 pl-6'>
                                                                <h2 className='font-semibold text-[#0A1F44] text-lg'>{value}</h2>
                                                                <p className='flex gap-1.5 items-center text-sm text-gray-600'>
                                                                    <MapPin size={14} className="text-[#14B8A6]" />
                                                                    {row.location}
                                                                </p>
                                                            </div>
                                                        ) : ""}

                                                        {column.id === 'location' ? (
                                                            <div className='text-base text-gray-700 font-medium'>{value}</div>
                                                        ) : ""}

                                                        {column.id === 'date' ? (
                                                            <div className='text-sm text-gray-600'>{value}</div>
                                                        ) : ""}

                                                        {column.id === 'action' ? (
                                                            <div className='flex gap-2 justify-center py-2'>
                                                                <a
                                                                    href={`/all-trainings/job?id=${row.uid}`}
                                                                    className='inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-4 py-2.5 font-semibold rounded-xl transition-colors shadow-md shadow-[#14B8A6]/20'
                                                                >
                                                                    <Eye size={16} />
                                                                    View
                                                                </a>
                                                                <button
                                                                    onClick={() => { props.delete(row.id) }}
                                                                    className='inline-flex items-center gap-2 bg-white border-2 border-red-200 hover:bg-red-50 text-red-600 px-4 py-2.5 font-semibold rounded-xl transition-colors'
                                                                >
                                                                    <Trash2 size={16} />
                                                                    Remove
                                                                </button>
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
