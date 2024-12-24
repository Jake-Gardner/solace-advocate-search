"use client";

import { Advocate } from '@/types';
import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import ClearIcon from '@mui/icons-material/Clear'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'

const PAGE_SIZE = 10

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const fetchAdvocates = async () => {
      const response = await fetch('/api/advocates?' + new URLSearchParams({
          term: searchTerm,
          limit: PAGE_SIZE.toString(),
          offset: (page * PAGE_SIZE).toString()
      }).toString())
      const jsonResponse = await response.json()
      setAdvocates(jsonResponse.data)
    }

    fetchAdvocates()
  }, [searchTerm, page]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value)
  };

  const onClearClick = () => {
    setSearchTerm('')
  };

  const onPageChange = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const formatPhoneNumber = (phoneNumber: number) => {
    const matches = phoneNumber.toString().match(/^(\d{3})(\d{3})(\d{4})/)
    if (matches) {
      return `(${matches[1]}) ${matches[2]}-${matches[3]}`
    }
    return phoneNumber.toString()
  }

  return (
    <main style={{ margin: "24px" }}>
      <Typography variant="h4">
        Solace Advocates
      </Typography>
      <br />
      <br />
      <div>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={onSearchChange}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">
                {searchTerm && <IconButton onClick={onClearClick}>
                  <ClearIcon />
                </IconButton>}
              </InputAdornment>
            },
          }}
        />
      </div>
      <br />
      <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Degree</TableCell>
              <TableCell>Specialties</TableCell>
              <TableCell>Years of Experience</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {advocates.map((advocate) => (
              <TableRow key={advocate.id}>
                <TableCell>{advocate.firstName}</TableCell>
                <TableCell>{advocate.lastName}</TableCell>
                <TableCell>{advocate.city}</TableCell>
                <TableCell>{advocate.degree}</TableCell>
                <TableCell>
                  {advocate.specialties.map((s) => (
                    <Chip key={s} label={s} sx={{ margin: '1px' }} />
                  ))}
                </TableCell>
                <TableCell>{advocate.yearsOfExperience}</TableCell>
                <TableCell>{formatPhoneNumber(advocate.phoneNumber)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={-1}
        rowsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={onPageChange}
      />
    </main>
  );
}
