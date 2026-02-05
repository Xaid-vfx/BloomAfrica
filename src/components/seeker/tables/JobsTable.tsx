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
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Trash2, MoreVertical, AlertTriangle } from "lucide-react";

interface Column {
    id: 'title' | 'applicants' | 'date' | 'action';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'title', label: 'TITLE', minWidth: 170 },
    { id: 'applicants', label: 'APPLICANTS', minWidth: 100 },
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
    applicants: number;
    date: string;
    action: string;
    uid: string
}

function createData(
    id: number,
    title: string,
    applicants: number,
    date: string,
    action: string,
    uid: string
): Data {

    return { id, title, applicants, date, action, uid };
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

export default function JobsTable(props: any) {
    console.log(props.jobs);

    const rows = [...props.jobs.map((job: any) => {
        return createData(job.id, job.title, 0, job.created_at.substring(0, job.created_at.indexOf('T')), "...", job.uid);
    })];

    rows.sort((a, b) => b.id - a.id);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(3);
    const [deleteConfirm, setDeleteConfirm] = React.useState<{ show: boolean; jobId: string; jobTitle: string }>({ show: false, jobId: '', jobTitle: '' });
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDeleteClick = (jobId: string, jobTitle: string) => {
        setDeleteConfirm({ show: true, jobId, jobTitle });
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        await props.delete(deleteConfirm.jobId);
        setIsDeleting(false);
        setDeleteConfirm({ show: false, jobId: '', jobTitle: '' });
    };

    const handleCancelDelete = () => {
        setDeleteConfirm({ show: false, jobId: '', jobTitle: '' });
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderBottomLeftRadius: "12px", borderBottomRightRadiusRadius: "12px", boxShadow: "none" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
                                        color: '#7C8493',
                                        fontWeight: '400',
                                        fontSize: '15px',
                                        borderTop: '1px solid #e5e7eb'
                                    }}
                                >
                                    {column.id == "title" ? <div className='pl-6'>{column.label}</div> : column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                console.log(row);

                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'title' ? (
                                                        <div className='flex-col gap-3 pr-10 pl-6'>


                                                            <h2 className='font-[500] font-sans text-lg'>{value}</h2>
                                                            <p className='flex gap-1 items-baseline text-sm text-[#14B8A6]'><HiOutlineLocationMarker /> Yaba, Lagos</p>

                                                        </div>
                                                    ) : ""}

                                                    {column.id === 'applicants' ? <div className='text-sm font-light font-sans text-[#7C8493]'>{value} Applicant('s')</div> : ""}

                                                    {column.id === 'date' ? <div className='text-base text-[#7C8493]'>{value}</div> : ""}

                                                    {column.id === 'action' ? <div className='flex items-center gap-2 justify-center py-1'>
                                                        <button onClick={() => {
                                                            props.ApplicationsForSelectedJob(row.uid)
                                                        }} className='text-center bg-[#14B8A6] hover:bg-[#0D9488] text-white px-4 py-2 font-semibold rounded-xl transition-colors'>
                                                            View Applicants</button>
                                                        <button
                                                            onClick={() => handleDeleteClick(row.uid, row.title)}
                                                            className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                                                            title="Delete listing"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div> : ""}
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
                // rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancelDelete}
                    />
                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-red-100 rounded-full p-3">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Apprenticeship</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete <span className="font-semibold">"{deleteConfirm.jobTitle}"</span>? All applications for this listing will also be removed.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Paper>
    );
}