<!DOCTYPE html>
<html lang="en" ng-app="migrationGeneratorApp">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel Migration Generator</title>
    <link rel="stylesheet" href="app.css">
</head>

<body ng-controller="migrationGeneratorController">
    <div id="sidebar">
        <h2>Projeto</h2>
        <ul ng-show="projectExpanded">
            <li ng-repeat="model in projectData.models">
                <span ng-click="toggleModel(model)">{{ model.tableName }}</span>
                <button class="remove-btn" ng-click="removeModel(model)">Remover</button>
                <ul ng-show="model.expanded">
                    <li ng-repeat="field in model.columns">
                        {{ field.name }} - {{ field.type }} ({{ field.defaultValue }}) {{ field.required ? 'Required' : '' }}
                    </li>
                </ul>
            </li>
        </ul>
        <button class="btn" ng-click="saveProjectToLocal()">Salvar Projeto</button>
        <button class="btn" ng-click="addNewModel()">Novo Modelo</button>
    </div>

    <div id="container">
        <h1>Laravel Migration Generator</h1>
        <form id="migrationForm">
            <label for="tableName">Nome da Tabela:</label>
            <input type="text" id="tableName" name="tableName" ng-model="selectedModel.tableName" required><br><br>

            <label for="softDeleteCheckbox">
                <input type="checkbox" id="softDeleteCheckbox" ng-model="selectedModel.softDelete"> Soft Delete
            </label><br><br>

            <table>
                <thead>
                    <tr>
                        <th>Nome da Coluna</th>
                        <th>Tipo</th>
                        <th>Valor Padrão</th>
                        <th>Required</th>
                        <th>Remover</th>
                    </tr>
                </thead>
                <tbody>
                    <tr ng-repeat="column in selectedModel.columns track by $index">
                        <td><input type="text" class="columnName" ng-model="selectedModel.columns[$index].name" required></td>
                        <td>
                            <select class="columnType" ng-model="selectedModel.columns[$index].type" required>
                                <option value="">Selecione o Tipo</option>
                                <option ng-repeat="type in columnTypes" value="{{ type }}">{{ type }}</option>
                            </select>
                        </td>
                        <td><input type="text" ng-model="selectedModel.columns[$index].defaultValue"></td>
                        <td><input type="checkbox" ng-model="selectedModel.columns[$index].required"></td>
                        <td><button type="button" class="remove-btn" ng-click="removeColumn($index)">Remover</button></td>
                    </tr>
                </tbody>
            </table>

            <button type="button" class="btn" ng-click="addColumn()">Adicionar Coluna</button><br><br>

            <button type="button" class="btn" ng-click="generateMigration()">Gerar Migration</button>
        </form>

        <div id="output" style="margin-top: 20px;">{{ migrationCode }}</div>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="app.js"></script>
</body>

</html>
