// App.jsx
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Modal, Box, TextField, Typography, IconButton,
  AppBar, Toolbar // Adicionado AppBar e Toolbar para a barra de navegação
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

// Estilo para os modais
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper', // Fundo branco para o conteúdo do modal
  boxShadow: 24, // Sombra padrão
  p: 4, // Preenchimento interno do modal
  borderRadius: 2, // Cantos arredondados
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

  // Buscar produtos quando o componente é montado
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products/findall', {
        params: { page: 0, size: 10 } // Paginação de exemplo
      });
      setProducts(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      // Você poderia adicionar tratamento de erro para o usuário aqui (ex: um snackbar)
    }
  };

  // Manipular mudanças nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Criar um novo produto
  const handleCreate = async () => {
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0, // Garantir que o preço seja um número
        amount: parseInt(formData.amount, 10) || 0 // Garantir que a quantidade seja um inteiro
      };
      await axios.post('http://localhost:8080/products/save', payload);
      setOpenCreateModal(false);
      setFormData({ name: '', description: '', price: '', amount: '' }); // Resetar formulário
      fetchProducts(); // Atualizar lista de produtos
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  // Atualizar um produto existente
  const handleUpdate = async () => {
    if (!selectedProduct) return;
    try {
      const payload = {
        id: selectedProduct.id,
        ...formData,
        price: parseFloat(formData.price) || 0,
        amount: parseInt(formData.amount, 10) || 0
      };
      await axios.put('http://localhost:8080/products/update', payload);
      setOpenUpdateModal(false);
      setFormData({ name: '', description: '', price: '', amount: '' });
      fetchProducts();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  // Deletar um produto
  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      // Para requisições DELETE com corpo, o Axios usa a propriedade 'data'.
      // Certifique-se de que seu backend está configurado para lidar com DELETE com corpo de requisição
      // ou modifique para enviar o ID como variável de caminho ou parâmetro de consulta, se preferir.
      await axios.delete('http://localhost:8080/products/delete', {
        data: {
          id: selectedProduct.id,
          name: selectedProduct.name, // Enviando objeto completo conforme o código original
          description: selectedProduct.description,
          price: selectedProduct.price,
          amount: selectedProduct.amount
        }
      });
      setOpenDeleteModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  // Abrir modal de atualização e pré-preencher dados do formulário
  const handleOpenUpdateModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(), // TextFields esperam valores do tipo string
      amount: product.amount.toString()
    });
    setOpenUpdateModal(true);
  };

  // Abrir modal de criação e resetar dados do formulário
  const handleOpenCreateModal = () => {
    setFormData({ name: '', description: '', price: '', amount: '' }); // Resetar formulário para novo produto
    setOpenCreateModal(true);
  };

  return (
    <> {/* React Fragment para agrupar AppBar e conteúdo principal */}
      {/* Barra de Navegação */}
      <AppBar position="static" sx={{ backgroundColor: '#1976D2' /* Um azul agradável */ }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ProdSys
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Área de Conteúdo Principal */}
      <Box sx={{
        padding: 3, // Preenchimento consistente ao redor do conteúdo
        backgroundColor: '#f4f6f8', // Fundo cinza claro para a área de conteúdo, contrastando com o Paper
        minHeight: 'calc(100vh - 64px)', // Garantir que a área de conteúdo preencha a altura da viewport abaixo da AppBar (64px é a altura típica da AppBar)
      }}>
        <Button
          variant="contained"
          onClick={handleOpenCreateModal}
          style={{ marginBottom: 20 }} // Mantendo estilo original conforme solicitado
          sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.9rem', padding: '8px 22px' }} // Estilização moderna do botão
        >
          Adicionar Produto
        </Button>

        {/* Tabela de Produtos */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2, // Cantos levemente arredondados para o contêiner da tabela
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Sombra mais suave para um visual moderno
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: '#e3f2fd' /* Azul claro para o cabeçalho da tabela */ }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#0d47a1' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0d47a1' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0d47a1' }}>Descrição</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0d47a1' }}>Preço</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0d47a1' }}>Quantidade</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0d47a1', textAlign: 'center' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  hover // Destacar linha ao passar o mouse (hover)
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } /* Listras zebradas sutis */ }}
                >
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>R$ {typeof product.price === 'number' ? product.price.toFixed(2) : (parseFloat(product.price) || 0).toFixed(2)}</TableCell>
                  <TableCell>{product.amount}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton color="primary" onClick={() => handleOpenUpdateModal(product)} aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => {
                      setSelectedProduct(product);
                      setOpenDeleteModal(true);
                    }} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal de Criação de Produto */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            Criar Novo Produto
          </Typography>
          <TextField fullWidth label="Nome" name="name" value={formData.name} onChange={handleInputChange} margin="normal" />
          <TextField fullWidth label="Descrição" name="description" value={formData.description} onChange={handleInputChange} margin="normal" />
          <TextField
            fullWidth label="Preço" name="price" type="number" value={formData.price} onChange={handleInputChange} margin="normal"
            InputProps={{ startAdornment: <Typography sx={{ mr: 0.5 }}>R$</Typography> }}
          />
          <TextField fullWidth label="Quantidade" name="amount" type="number" value={formData.amount} onChange={handleInputChange} margin="normal" />
          <Button variant="contained" onClick={handleCreate} sx={{ mt: 2.5, width: '100%', py: 1.5, fontWeight: 'bold' }}>
            Criar
          </Button>
        </Box>
      </Modal>

      {/* Modal de Atualização de Produto */}
      <Modal open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            Atualizar Produto
          </Typography>
          <TextField fullWidth label="Nome" name="name" value={formData.name} onChange={handleInputChange} margin="normal" />
          <TextField fullWidth label="Descrição" name="description" value={formData.description} onChange={handleInputChange} margin="normal" />
          <TextField
            fullWidth label="Preço" name="price" type="number" value={formData.price} onChange={handleInputChange} margin="normal"
            InputProps={{ startAdornment: <Typography sx={{ mr: 0.5 }}>R$</Typography> }}
          />
          <TextField fullWidth label="Quantidade" name="amount" type="number" value={formData.amount} onChange={handleInputChange} margin="normal" />
          <Button variant="contained" onClick={handleUpdate} sx={{ mt: 2.5, width: '100%', py: 1.5, fontWeight: 'bold' }}>
            Atualizar
          </Button>
        </Box>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Confirmar Exclusão
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Deseja realmente excluir o produto <strong>{selectedProduct?.name}</strong>? Esta ação não pode ser desfeita.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} sx={{ textTransform: 'none' }}>
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
              Excluir
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default App;