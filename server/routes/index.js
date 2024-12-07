//import routes

const constructorMethod = (app) => {
  
// app.use('/api/blogs', blogRoutes); One or more routes if needed

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
};

export default constructorMethod;
