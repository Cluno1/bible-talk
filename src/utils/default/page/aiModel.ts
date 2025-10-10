import type { BibleTalkDataType } from "@/type/page";


/* 1. 什么是AI模型 --------------------------------------------------------- */
const aiSec1: BibleTalkDataType = {
  id: "ai-sec1",
  title: "What is an AI Model",
  subTitle: "什么是AI模型",
  name: "AI Model",
  englishName: "ai-model",
  children: [
    {
      id: "ai-sec1-1",
      title: "1. 定义与本质",
      name: "definition",
      englishName: "definition",
      content: [
        {
          paragraphs:
            "**AI模型**是一个由数学与统计学驱动、用海量数据“喂”出来的函数。它接收输入（文本、图像、声音等），输出人类想要的预测或生成结果。",
        },
        {
          quote:
            "“本质上，AI模型是一组可学习的参数，在训练过程中不断调整，以最小化预测误差。”——《深度学习》（Goodfellow）",
        },
      ],
    },
    {
      id: "ai-sec1-2",
      title: "2. 分类总览",
      name: "categories",
      englishName: "categories",
      content: [
        {
          paragraphs:
            "按**任务类型**可粗分四类：判别式（分类/回归）、生成式（文本到图像、代码到文本）、强化式（AlphaGo）、混合式（Diffusion + LLM）。",
        },
        {
          paragraphs:
            "按**结构**又可分：CNN（视觉）、RNN/Transformer（序列）、GNN（图）、Diffusion（生成）。",
        },
      ],
    },
    {
      id: "ai-sec1-3",
      title: "3. 生命周期",
      name: "lifecycle",
      englishName: "lifecycle",
      content: [
        {
          paragraphs:
            "**数据→清洗→训练→验证→部署→监控→迭代**。任何一环失守，模型就会“偏科”或“失控”。",
        },
        {
          quote:
            "“垃圾进，垃圾出——数据质量决定模型天花板。”——Andrew Ng",
        },
      ],
    },
  ],
  reference: [
    {
      text: "知乎专栏：AI模型全景梳理",
      link: "https://zhuanlan.zhihu.com/p/678046050",
    },
  ],
  icon: "Cpu",
  rank: 10,
};

/* 2. 大语言模型(LLM) ------------------------------------------------------- */
const aiSec2: BibleTalkDataType = {
  id: "ai-sec2",
  title: "Large Language Model",
  subTitle: "大语言模型",
  name: "LLM",
  englishName: "llm",
  children: [
    {
      id: "ai-sec2-1",
      title: "1. 核心原理",
      name: "transformer",
      englishName: "transformer",
      content: [
        {
          paragraphs:
            "基于**Transformer**架构，仅通过“**next-token prediction**”自监督学习，就能在千亿参数 scale 上涌现出推理、翻译、代码能力。",
        },
        {
          quote:
            "“Attention is All You Need.”——Vaswani et al., 2017",
        },
      ],
    },
    {
      id: "ai-sec2-2",
      title: "2. 能力涌现",
      name: "emergence",
      englishName: "emergence",
      content: [
        {
          paragraphs:
            "当参数>10B、训练量>100B tokens 时，模型突然具备**in-context learning**、**chain-of-thought**、**代码生成**等能力，且随规模指数提升。",
        },
      ],
    },
    {
      id: "ai-sec2-3",
      title: "3. 局限与风险",
      name: "limitation",
      englishName: "limitation",
      content: [
        {
          paragraphs:
            "**幻觉**（一本正经地编造）、**偏见**（训练语料倾斜）、**知识截断**（无法感知最新事件）。",
        },
        {
          quote:
            "“LLM 不是知识库，而是概率复读机。”——Yann LeCun",
        },
      ],
    },
  ],
  reference: [
    {
      text: "OpenAI：GPT-4 Technical Report",
      link: "https://cdn.openai.com/papers/gpt-4.pdf",
    },
  ],
  icon: "Document",
  rank: 20,
};

/* 3. 多模态与Agent -------------------------------------------------------- */
const aiSec3: BibleTalkDataType = {
  id: "ai-sec3",
  title: "Multimodal & AI Agent",
  subTitle: "多模态与智能体",
  name: "Agent",
  englishName: "agent",
  children: [
    {
      id: "ai-sec3-1",
      title: "1. 多模态模型",
      name: "multimodal",
      englishName: "multimodal",
      content: [
        {
          paragraphs:
            "把文本、视觉、音频统一 token 化，用**单一大模型**完成图文互生、视频理解、声音克隆。代表：GPT-4V、Flamingo、LLaVA。",
        },
      ],
    },
    {
      id: "ai-sec3-2",
      title: "2. AI Agent 框架",
      name: "agent-framework",
      englishName: "agent-framework",
      content: [
        {
          paragraphs:
            "LLM 作为**推理引擎**，外挂记忆、工具、行动接口，形成**感知→计划→行动→观察**的闭环。AutoGPT、LangChain、ChatGPT Plugins 均属此类。",
        },
        {
          quote:
            "“Agent = LLM + Memory + Planning + Tool Use.”——Lilian Weng",
        },
      ],
    },
    {
      id: "ai-sec3-3",
      title: "3. 安全与对齐",
      name: "alignment",
      englishName: "alignment",
      content: [
        {
          paragraphs:
            "RLHF、RLAIF、Constitutional AI 被用于**价值观对齐**；红队测试、Interpretability 研究试图**打开黑箱**。”",
        },
      ],
    },
  ],
  reference: [
    {
      text: "Lilian Weng Blog: LLM-powered Agent",
      link: "https://lilianweng.github.io/posts/2023-06-23-agent/",
    },
  ],
  icon: "Connection",
  rank: 30,
};

/* 4. 如何训练你自己的小模型 ---------------------------------------------- */
const aiSec4: BibleTalkDataType = {
  id: "ai-sec4",
  title: "Train Your Own Model",
  subTitle: "训练自己的小模型",
  name: "Training",
  englishName: "training",
  children: [
    {
      id: "ai-sec4-1",
      title: "1. 数据准备",
      name: "data-prep",
      englishName: "data-prep",
      content: [
        {
          paragraphs:
            "**Rule 1**: 质量 > 数量；**Rule 2**: 先清洗再标注；**Rule 3**: 保持分布平衡。",
        },
      ],
    },
    {
      id: "ai-sec4-2",
      title: "2. 训练策略",
      name: "strategy",
      englishName: "strategy",
      content: [
        {
          paragraphs:
            "通用流程：**预训练→监督微调→RLHF**。硬件：A100 80G × 8 是“平民”天花板；LoRA/QLoRA 可降低 90% 显存。",
        },
      ],
    },
    {
      id: "ai-sec4-3",
      title: "3. 评估与迭代",
      name: "evaluation",
      englishName: "evaluation",
      content: [
        {
          paragraphs:
            "自动指标：Perplexity、BLEU、ROUGE；人工指标：Helpfulness, Harmlessness, Honesty（HHH）。",
        },
        {
          quote:
            "“没有评测，就没有进步。”——Hugging Face",
        },
      ],
    },
  ],
  reference: [
    {
      text: "Hugging Face: Transformer Fine-Tuning",
      link: "https://huggingface.co/docs/transformers/training",
    },
  ],
  icon: "Tools",
  rank: 40,
};

/* 汇总根节点 -------------------------------------------------------------- */
export const aiModelHandbook: BibleTalkDataType = {
  id: "ai-model-handbook",
  hasOverview: true,
  title: "AI模型全景手册",
  subTitle: "从原理到落地的系统指南",
  name: "AI Models",
  englishName: "ai-models",
  children: [aiSec1, aiSec2, aiSec3, aiSec4],
  content: undefined,
  reference: null,
  icon: "Cpu",
  rank: 10,
};