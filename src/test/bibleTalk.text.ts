import type { BibleTalkDataType } from "@/store/bibleTalkStore";

export const btDataDemo: BibleTalkDataType = {
  id: "cs-ai",
  title: "人工智能",
  subTitle: "Artificial Intelligence",
  titleLeftColor: "#00BFFF",
  titleColor: "#FFFFFF",
  name: "ai-overview",
  englishName: "al-overview",
  children: [
    {
      id: "cs-ai-ml",
      title: "机器学习",
      subTitle: "Machine Learning",
      titleLeftColor: "#32CD32",
      titleColor: "#FFFFFF",
      name: "ml-basics",
      englishName: "ml-asics",
      children: [
        {
          id: "cs-ai-ml-dl",
          title: "深度学习",
          subTitle: "Deep Learning",
          titleLeftColor: "#FF6347",
          titleColor: "#FFFFFF",
          name: "deep learning",
          englishName: "deep-learning",
          content: [
            {
              paragraphs:
                "**神经网络** 是深度学习的基础，由多层感知器堆叠而成。",
              quote: "“深度学习让我们能够训练拥有千万参数的模型。”"
            },
            {
              paragraphs:
                "**反向传播** 算法通过链式法则高效地计算梯度，实现参数更新。",
              quote: "“没有反向传播，就没有今天的 AI 繁荣。”"
            },
            {
              paragraphs:
                "**GPU 加速** 使得大规模矩阵运算可在合理时间内完成，推动研究快速迭代。",
              quote: "“英伟达的 CUDA 生态奠定了深度学习硬件基石。”"
            }
          ],
          reference: [
            {
              text: "Deep Learning (Goodfellow et al.)",
              link: "https://www.deeplearningbook.org/"
            }
          ]
        }
      ],
      content: [
        {
          paragraphs:
            "**监督学习** 通过带标签数据训练模型，实现分类或回归任务。",
          quote: "“数据是新时代的石油。”"
        },
        {
          paragraphs:
            "**无监督学习** 在没有标签的情况下挖掘数据内在结构，如聚类与降维。",
          quote: "“聚类揭示了数据隐藏的模式。”"
        },
        {
          paragraphs:
            "**强化学习** 通过试错与奖励机制让智能体在环境中学习最优策略。",
          quote: "“AlphaGo 的胜利标志着强化学习的里程碑。”"
        }
      ],
      reference: [
        {
          text: "Pattern Recognition and Machine Learning (Bishop)",
          link: "https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf"
        }
      ]
    }
  ],
  content: [
    {
      paragraphs:
        "**人工智能** 旨在让机器具备类人智能，涵盖感知、推理、学习与决策。",
      quote: "“AI 是新时代的电力。”"
    },
    {
      paragraphs:
        "**弱人工智能** 专注于特定任务，如语音识别或图像分类，已取得巨大成功。",
      quote: "“今天我们所见的大多数 AI 应用都属于弱人工智能。”"
    },
    {
      paragraphs:
        "**通用人工智能(AGI)** 具备跨领域学习与推理能力，仍是前沿研究目标。",
      quote: "“AGI 的实现将重新定义人类与机器的关系。”"
    }
  ],
  reference: [
    {
      text: "Artificial Intelligence: A Modern Approach (Russell & Norvig)",
      link: "http://aima.cs.berkeley.edu/"
    }
  ]
};