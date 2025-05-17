// App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Modal, Box, TextField, Typography, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    amount: ''
  });

  // Buscar produtos
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products/findall', {
        params: { page: 0, size: 10 }
      });
      setProducts(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Manipular mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Criar produto
  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:8080/products/save', formData);
      setOpenCreateModal(false);
      setFormData({ name: '', description: '', price: '', amount: '' });
      fetchProducts();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  // Atualizar produto
  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:8080/products/update', {
        id: selectedProduct.id,
        ...formData
      });
      setOpenUpdateModal(false);
      setFormData({ name: '', description: '', price: '', amount: '' });
      fetchProducts();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  // Deletar produto
  const handleDelete = async () => {
    try {
      await axios.put('http://localhost:8080/products/delete', {
        id: selectedProduct.id,
        ...formData
      });
      setOpenDeleteModal(false);
      setFormData({ name: '', description: '', price: '', amount: '' });
      fetchProducts();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  // Abrir modal de atualização com dados preenchidos
  const handleOpenUpdateModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      amount: product.amount
    });
    setOpenUpdateModal(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <Button 
        variant="contained" 
        onClick={() => setOpenCreateModal(true)}
        style={{ marginBottom: 20 }}
      >
        Adicionar Produto
      </Button>

      {/* Tabela de Produtos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.amount}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenUpdateModal(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => {
                    setSelectedProduct(product);
                    setOpenDeleteModal(true);
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Criação */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Criar Novo Produto
          </Typography>
          <TextField
            fullWidth
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Preço"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quantidade"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleCreate}
            style={{ marginTop: 20 }}
          >
            Criar
          </Button>
        </Box>
      </Modal>

      {/* Modal de Atualização */}
      <Modal open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Atualizar Produto
          </Typography>
          <TextField
            fullWidth
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Preço"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quantidade"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleUpdate}
            style={{ marginTop: 20 }}
          >
            Atualizar
          </Button>
        </Box>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Confirmar Exclusão
          </Typography>
          <Typography>
            Deseja realmente excluir o produto {selectedProduct?.name}?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Excluir
            </Button>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default App;