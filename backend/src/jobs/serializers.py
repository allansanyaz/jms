from rest_framework import serializers
from django.contrib.auth.models import User, Group
from jobs.models import *

class ToolVersionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToolVersion
        fields = ('ToolVersionID', 'ToolVersionNum', 'DatePublished')


class ToolListSerializer(serializers.ModelSerializer):
    ToolVersions = ToolVersionListSerializer(many=True)
    
    class Meta:
        model = Tool
        fields = ('ToolID', 'ToolName', 'Category', 'ToolDescription', 
            'PublicInd', 'ToolVersions', 'DeletedInd')


class ToolCategoryListSerializer(serializers.ModelSerializer):
    Tools = ToolListSerializer(many=True)
    
    class Meta:
        model = Category
        fields = ('ToolCategoryID', 'ToolCategoryName', 'Tools')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = "__all__"


class ParameterTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParameterType
        fields = "__all__"


class ParameterOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParameterOption
        fields = "__all__"


class ParameterDetailSerializer(serializers.ModelSerializer):
    ParameterOptions = ParameterOptionSerializer(many=True)
    
    class Meta:
        model = Parameter
        fields = "__all__"


class ParameterListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameter
        fields = ('ParameterID','ParameterName', 'Context', 'InputBy', 
            'ParentParameter', 'ParameterType')


class ExpectedOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpectedOutput
        fields = "__all__"


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToolVersionResource
        fields = "__all__"


class ToolVersionDetailSerializer(serializers.ModelSerializer):
    Tool = ToolListSerializer()
    ToolParameters = ParameterDetailSerializer(many=True)
    ExpectedOutputs = ExpectedOutputSerializer(many=True)
    Resources = ResourceSerializer(many=True)
    
    class Meta:
        model = ToolVersion
        fields = "__all__"


class FileTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileType
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class UserToolPermissionSerializer(serializers.ModelSerializer):
    User = UserSerializer()
    
    class Meta:
        model = UserToolPermission
        fields = ('User', 'Run', 'Edit', 'Export', 'Publish', 'Admin')


class ToolPermissionSerializer(serializers.ModelSerializer):
    User = UserSerializer()
    UserToolPermissions = UserToolPermissionSerializer(many=True)
    
    class Meta:
        model = Tool
        fields = ('ToolID', 'ToolName', 'PublicInd', 'User', 'UserToolPermissions')


class WorkflowVersionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowVersion
        fields = ('WorkflowVersionID', 'WorkflowVersionNum')


class WorkflowListSerializer(serializers.ModelSerializer):
    WorkflowVersions = WorkflowVersionListSerializer(many=True)
    
    class Meta:
        model = Workflow
        fields = ('WorkflowID', 'WorkflowName', 'Category', 'Description', 
            'PublicInd', 'WorkflowVersions', 'DeletedInd')


class UserWorkflowPermissionSerializer(serializers.ModelSerializer):
    User = UserSerializer()
    
    class Meta:
        model = UserWorkflowPermission
        fields = ('User', 'Run', 'Edit', 'Export', 'Publish', 'Admin')


class WorkflowPermissionSerializer(serializers.ModelSerializer):
    User = UserSerializer()
    UserWorkflowPermissions = UserToolPermissionSerializer(many=True)
    
    class Meta:
        model = Workflow
        fields = ('WorkflowID', 'WorkflowName', 'PublicInd', 'User', 'UserWorkflowPermissions')


class StageParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = StageParameter
        fields = "__all__"

class StageDetailSerializer(serializers.ModelSerializer):
    ToolVersion = ToolVersionDetailSerializer()
    StageParameters = StageParameterSerializer(many=True)
    
    class Meta:
        model = Stage
        fields = "__all__"


class WorkflowVersionDetailSerializer(serializers.ModelSerializer):
    Workflow = WorkflowListSerializer()
    WorkflowVersionStages = StageDetailSerializer(many=True)
    
    class Meta:
        model = WorkflowVersion
        fields = "__all__"


class StageWorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = ('WorkflowID', 'WorkflowName')


class StageWorkflowVersionSerializer(serializers.ModelSerializer):
    Workflow = StageWorkflowSerializer()
    
    class Meta:
        model = WorkflowVersion
        fields = ('WorkflowVersionID', 'Workflow', 'WorkflowVersionNum')


class StageToolSerializer(serializers.ModelSerializer):
    ToolVersions = ToolVersionListSerializer(many=True)
    
    class Meta:
        model = Tool
        fields = ('ToolID', 'ToolName', 'ToolVersions')


class StageExpectedOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameter
        fields = ('ExpectedOutputID', 'ExpectedOutputName')


class StageToolParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameter
        fields = ('ParameterID', 'ParameterName', 'ParameterType')


class StageExpectedOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpectedOutput
        fields = ('ExpectedOutputID', 'OutputName')
  

class StageToolVersionSerializer(serializers.ModelSerializer):
    Tool = StageToolSerializer()
    ToolParameters = StageToolParameterSerializer(many=True)
    ExpectedOutputs = StageExpectedOutputSerializer(many=True)
    
    class Meta:
        model = ToolVersion
        fields = ('ToolVersionID', 'Tool', 'ToolVersionNum', 'ToolParameters',
            'ExpectedOutputs')


class StageDependencyList(serializers.ModelSerializer):
    class Meta:
        model = StageDependency
        fields = "__all__"


class StageParameterList(serializers.ModelSerializer):
    class Meta:
        model = StageParameter
        fields = "__all__"


class StageListSerializer(serializers.ModelSerializer):
    ToolVersion = StageToolVersionSerializer()
    SubWorkflowVersion = StageWorkflowVersionSerializer()
    StageDependencies = StageDependencyList(many=True)
    StageParameters = StageParameterList(many=True)
    
    class Meta:
        model = Stage
        fields = ('StageID', 'ToolVersion', 'SubWorkflowVersion', 'Checkpoint', 
            'StageLevel', 'left_co_ord', 'top_co_ord', 'StageDependencies',
            'StageParameters')


class StageLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = ('StageID', 'StageLevel')


class JobStageStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobStage
        fields = ('Status', 'ClusterJobID')


class JobToolSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Tool
        fields = ('ToolID', 'ToolName')


class JobToolVersionSerializer(serializers.ModelSerializer):
    Tool = JobToolSerializer()
    
    class Meta:
        model = ToolVersion
        fields = ('ToolVersionID', 'Tool', 'ToolVersionNum')

    
class JobListSerializer(serializers.ModelSerializer):
    JobStages = JobStageStatusSerializer(many=True)
    WorkflowVersion = StageWorkflowVersionSerializer()
    ToolVersion = JobToolVersionSerializer()
    
    class Meta:
        model = Job
        fields = "__all__"

class StageSerializer(serializers.ModelSerializer):
    ToolVersion = JobToolVersionSerializer()
    
    class Meta:
        model = Stage
        fields = ('StageID', 'StageLevel', 'ToolVersion', 'Checkpoint')
    

class JobStageDataFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobStageDataField
        fields = "__all__"
    

class JobStageDataSectionSerializer(serializers.ModelSerializer):
    DataFields = JobStageDataFieldSerializer(many=True)
    
    class Meta:
        model = JobStageDataSection
        fields = "__all__"


class JobStageParameterDetailSerializer(serializers.ModelSerializer):
    Parameter = ParameterListSerializer()
    
    class Meta:
        model = JobStageParameter
        fields = "__all__"

    
class JobStageDetailSerializer(serializers.ModelSerializer):
    JobStageParameters = JobStageParameterDetailSerializer(many=True)
    Stage = StageSerializer()
    
    class Meta:
        model = JobStage
        fields = "__all__"


class JobDetailSerializer(serializers.ModelSerializer):
    JobStages = JobStageDetailSerializer(many=True)
    WorkflowVersion = StageWorkflowVersionSerializer()
    ToolVersion = JobToolVersionSerializer()
    
    class Meta:
        model = Job
        fields = "__all__"
