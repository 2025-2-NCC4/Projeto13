import React from 'react';

const ProjectTable = () => {
  const projects = [
    { name: 'Projeto A', status: 'Concluído', value: 'R$2.500,00', start: '12/06/2024', end: '12/06/2024' },
    { name: 'Projeto B', status: 'Pendente', value: 'R$3.750,00', start: '18/06/2024', end: '30/08/2024' },
    { name: 'Projeto C', status: 'Pendente', value: 'R$1.250,00', start: '20/06/2024', end: '25/08/2024' },
    { name: 'Projeto D', status: 'Concluído', value: 'R$5.000,00', start: '25/12/2024', end: '27/06/2025' }
  ];

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Valor</th>
            <th>Inicio</th>
            <th>Conclusão</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.name}</td>
              <td>
                <span className={`status ${project.status === 'Concluído' ? 'completed' : 'pending'}`}>
                  {project.status}
                </span>
              </td>
              <td>{project.value}</td>
              <td>{project.start}</td>
              <td>{project.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;