angular.module('migrationGeneratorApp', [])
    .controller('migrationGeneratorController', function($scope, $window) {
        $scope.columns = [{
            name: '',
            type: '',
            defaultValue: '',
            required: false
        }];
        $scope.columnTypes = ['bigInteger', 'binary', 'boolean', 'char',  'dateTime', 'date', 'decimal', 'double', 'enum', 'float', 'foreignId', 'foreignIdFor', 'foreignUlid',  'geography', 'geometry', 'id', 'integer', 'ipAddress', 'json', 'jsonb', 'longText',  'rememberToken', 'set', 'smallIncrements', 'smallInteger',  'softDeletes', 'string', 'text',  'time', 'timestamp',  'timestamps', 'tinyInteger', 'tinyText',  'year'];
        $scope.projectData = {
            models: []
        };

        $scope.projectExpanded = true;
        $scope.selectedModel = null;

        $scope.addColumn = function() {
            $scope.columns.push({
                name: '',
                type: '',
                defaultValue: '',
                required: false
            });
        };

        $scope.removeColumn = function(index) {
            $scope.columns.splice(index, 1);
        };

        $scope.saveProjectToLocal = function() {
            // Salvar estrutura do projeto no localStorage
            $window.localStorage.setItem('projectData', JSON.stringify($scope.projectData));
        };

        $scope.generateMigration = function() {
            var migrationCode = '';
            var tableName = $scope.selectedModel.tableName.trim();

            if ($scope.selectedModel.softDelete) {
                migrationCode += `$table->softDeletes();\n`;
            }

            $scope.selectedModel.columns.forEach(function(column) {
                var columnName = column.name.trim();
                var columnType = column.type.trim();
                var defaultValue = column.defaultValue.trim();
                var required = column.required ? '->required()' : '';

                if (columnName !== "" && columnType !== "") {
                    migrationCode += `$table->${columnType}('${columnName}')`;
                    if (defaultValue !== "") {
                        migrationCode += `->default('${defaultValue}')`;
                    }
                    migrationCode += required + `;\n`;
                }
            });

            $scope.migrationCode = migrationCode;

            var existingModelIndex = $scope.projectData.models.findIndex(function(existingModel) {
                return existingModel.tableName === $scope.selectedModel.tableName;
            });

            if (existingModelIndex !== -1) {
                $scope.projectData.models[existingModelIndex] = $scope.selectedModel;
            } else {
                $scope.projectData.models.push($scope.selectedModel);
            }

            // Salvar estrutura do projeto no localStorage após gerar a migration
            $window.localStorage.setItem('projectData', JSON.stringify($scope.projectData));
        };

        $scope.toggleModel = function(model) {
            model.expanded = !model.expanded;
            $scope.selectedModel = angular.copy(model);
        };

        $scope.removeModel = function(model) {
            var confirmation = $window.confirm("Tem certeza de que deseja remover este modelo?");
            if (confirmation) {
                var modelIndex = $scope.projectData.models.indexOf(model);
                if (modelIndex !== -1) {
                    $scope.projectData.models.splice(modelIndex, 1);
                    $scope.selectedModel = null;
                }
            }
        };

        $scope.addNewModel = function() {
            // Limpar o formulário para adicionar um novo modelo
            $scope.selectedModel = {
                tableName: '',
                columns: [{
                    name: '',
                    type: '',
                    defaultValue: '',
                    required: false
                }],
                softDelete: false
            };
        };

        // Carregar dados do localStorage ao iniciar
        var savedProjectData = $window.localStorage.getItem('projectData');
        if (savedProjectData) {
            $scope.projectData = JSON.parse(savedProjectData);
        }
    });
