import { useState } from "react";
import { ADMIN_CREDENTIALS, INITIAL_PRODUCTS, SALES_DATA, Product } from "@/data/mock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Package, Users, DollarSign, LogOut } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      toast({ title: "Bienvenido", description: "Sesión iniciada correctamente." });
    } else {
      toast({ title: "Error", description: "Credenciales incorrectas.", variant: "destructive" });
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newProduct: Product = {
      id: Date.now(),
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800" // Placeholder
    };

    setProducts([...products, newProduct]);
    toast({ title: "Producto Agregado", description: "El producto se ha añadido al inventario." });
    form.reset();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 pt-20">
        <Card className="w-full max-w-md mx-6">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-center">Acceso Administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Usuario</label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="admin"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                />
              </div>
              <Button type="submit" className="w-full">Ingresar</Button>
            </form>
            <p className="text-xs text-center text-muted-foreground mt-4">
              (Use admin / password123)
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary">Dashboard</h1>
          <p className="text-muted-foreground">Gestión de inventario y ventas</p>
        </div>
        <Button variant="outline" onClick={() => setIsAuthenticated(false)} className="gap-2">
          <LogOut size={16} /> Salir
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ventas Totales</p>
              <h3 className="text-2xl font-bold">$34,200</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-full text-accent">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Productos Activos</p>
              <h3 className="text-2xl font-bold">{products.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clientes Fieles</p>
              <h3 className="text-2xl font-bold">128</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Productos & Stock</TabsTrigger>
          <TabsTrigger value="sales">Ventas & Reportes</TabsTrigger>
          <TabsTrigger value="loyalty">Fidelización</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Inventario Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-secondary/50">
                        <tr>
                          <th className="px-6 py-3">Producto</th>
                          <th className="px-6 py-3">Categoría</th>
                          <th className="px-6 py-3">Precio</th>
                          <th className="px-6 py-3">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-border">
                            <td className="px-6 py-4 font-medium">{product.name}</td>
                            <td className="px-6 py-4">{product.category}</td>
                            <td className="px-6 py-4">${product.price}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {product.stock} un.
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Agregar Producto</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm">Nombre</label>
                      <Input name="name" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Categoría</label>
                      <Input name="category" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm">Precio</label>
                        <Input name="price" type="number" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm">Stock</label>
                        <Input name="stock" type="number" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full gap-2">
                      <Plus size={16} /> Agregar
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Ventas (Últimos 6 meses)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALES_DATA}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty">
          <Card>
            <CardHeader>
              <CardTitle>Programa de Fidelización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Nivel Oro</h4>
                    <p className="text-sm text-muted-foreground">Clientes con más de $2000 en compras anuales</p>
                  </div>
                  <Button variant="outline">Ver 12 Miembros</Button>
                </div>
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Nivel Plata</h4>
                    <p className="text-sm text-muted-foreground">Clientes con más de $1000 en compras anuales</p>
                  </div>
                  <Button variant="outline">Ver 45 Miembros</Button>
                </div>
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <h4 className="font-medium text-accent mb-2">Nueva Campaña</h4>
                  <p className="text-sm mb-4">Enviar cupón de 10% de descuento a clientes inactivos por 3 meses.</p>
                  <Button size="sm">Configurar Campaña</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
