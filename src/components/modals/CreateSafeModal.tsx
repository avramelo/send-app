import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface CreateSafeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (threshold: number, owners: string[]) => void;
}

export const CreateSafeModal = ({ open, onClose, onConfirm }: CreateSafeModalProps) => {
  const [threshold, setThreshold] = useState("1");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [owners, setOwners] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleAddOwner = () => {
    if (!ownerAddress) {
      setError("Please enter an owner address");
      return;
    }
    if (owners.includes(ownerAddress)) {
      setError("This address is already added");
      return;
    }
    setOwners([...owners, ownerAddress]);
    setOwnerAddress("");
    setError("");
  };

  const handleConfirm = () => {
    const thresholdNum = parseInt(threshold);
    if (thresholdNum > owners.length + 1) {
      setError("Threshold cannot be greater than number of owners");
      return;
    }
    if (thresholdNum < 1) {
      setError("Threshold must be at least 1");
      return;
    }
    onConfirm(thresholdNum, owners);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Safe Wallet</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            You will be automatically added as an owner
          </Typography>

          <TextField
            fullWidth
            label="Threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            helperText="Number of required confirmations for transactions"
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Add Owner Address"
              value={ownerAddress}
              onChange={(e) => setOwnerAddress(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ mb: 1 }}
            />
            <Button variant="outlined" onClick={handleAddOwner}>
              Add Owner
            </Button>
          </Box>

          {owners.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Added Owners:
              </Typography>
              {owners.map((owner, index) => (
                <Typography key={owner} variant="body2">
                  {index + 1}. {owner}
                </Typography>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleConfirm}
            fullWidth
            disabled={!threshold || parseInt(threshold) < 1}
          >
            Create Safe Wallet
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
