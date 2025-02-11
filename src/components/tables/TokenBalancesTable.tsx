import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  address: string;
}

interface TokenBalancesTableProps {
  balances: TokenBalance[];
  onRowClick: (token: TokenBalance) => void;
}

export const TokenBalancesTable = ({ balances, onRowClick }: TokenBalancesTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {balances.map((token) => (
            <TableRow
              key={token.address}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{token.name}</TableCell>
              <TableCell>{token.symbol}</TableCell>
              <TableCell align="right">{token.balance}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onRowClick(token)}
                  disabled={parseFloat(token.balance) <= 0}
                >
                  Send
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
