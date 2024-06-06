import React from "react";
import { FaUser } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { green, red, yellow } from "@mui/material/colors";

const AdminTable = ({ userData, handleRowClick }) => (
  <TableContainer component={Paper}>
    <Table style={{ minWidth: 650 }} aria-label="admin table">
      <TableHead>
        <TableRow>
          <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
          <TableCell className="text-center" style={{ fontWeight: "bold" }}>
            Present Value
          </TableCell>
          <TableCell className="text-center" style={{ fontWeight: "bold" }}>
            Debt
          </TableCell>
          <TableCell className="text-center" style={{ fontWeight: "bold" }}>
            Quarterly Return
          </TableCell>
          <TableCell className="text-center" style={{ fontWeight: "bold" }}>
            Billable Amount
          </TableCell>
          <TableCell className="text-center" style={{ fontWeight: "bold" }}>
            Average PE
          </TableCell>
          <TableCell className="text-center" style={{ fontWeight: "bold" }}>
            Average Scope to Grow
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {userData.map((user, index) => (
          <TableRow
            key={index}
            onClick={() => handleRowClick(user.user_id)}
            style={{ cursor: "pointer" }}
          >
            <TableCell style={{ fontWeight: "600" }}>
              <FaUser style={{ marginRight: "8px" }} />
              {user.Name.toUpperCase()}
            </TableCell>
            <TableCell className="text-center">₹{user.presentValue}</TableCell>
            <TableCell className="text-center">₹{user.Debt}</TableCell>
            <TableCell
              className="text-center"
              style={{
                color:
                  user.quarterlyReturn < 5
                    ? red[500]
                    : user.quarterlyReturn < 10
                    ? yellow[700]
                    : green[500],
              }}
            >
              {user.quarterlyReturn}%
            </TableCell>
            <TableCell className="text-center">₹{user.billableAmount}</TableCell>
            <TableCell className="text-center">{user.averagePE}</TableCell>
            <TableCell className="text-center">{user.averageScopeToGrow}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default AdminTable;
